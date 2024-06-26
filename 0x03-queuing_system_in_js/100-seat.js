import express from 'express';
import redis from 'redis';
import { promisify } from 'util';
import kue, { createQueue } from 'kue';

const app = express();
const redisClient = redis.createClient();
const jobQueue = createQueue();

const getAsync = promisify(redisClient.get).bind(redisClient);
const setAsync = promisify(redisClient.set).bind(redisClient);

const reserveSeat = async (number) => {
  await setAsync('available_seats', number.toString());
};

const getCurrentAvailableSeats = async () => {
  const numberOfAvailableSeats = await getAsync('available_seats');
  return numberOfAvailableSeats ? parseInt(numberOfAvailableSeats) : 0;
};

reserveSeat(50);

let isReservationEnabled = true;

app.get('/available_seats', async function (req, res) {
  const availableSeats = await getCurrentAvailableSeats();
  res.json({ numberOfAvailableSeats: availableSeats });
});

app.get('/reserve_seat', (request, response) => {
  if (!isReservationEnabled) {
    return response.json({ status: 'Reservation are blocked' });
  }

  const job = jobQueue.create('reserve_seat').save((err) => {
    if (err) {
      return response.json({ status: 'Reservation failed' });
    }
    return response.json({ status: 'Reservation in process' });
  });

  job.on('complete', () => {
    console.log(`Seat reservation job ${job.id} completed`);
  })
    .on('failed', (err) => {
      console.log(`Seat reservation job ${job.id} failed: ${err.message || err.toString()}`);
    });
});

app.get('/process', async (request, response) => {
  response.json({ status: 'Queue processing' });

  await jobQueue.process('reserve_seat', async (job, done) => {
    const currentAvailableSeats = await getCurrentAvailableSeats();

    if (currentAvailableSeats <= 0) {
      isReservationEnabled = false;
      done(new Error('Not enough seats available'));
    } else {
      await reserveSeat(currentAvailableSeats - 1);
      if (currentAvailableSeats - 1 === 0) {
        isReservationEnabled = false;
      }
      done();
    }
  });
});

const PORT = 1245;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
