import { createQueue } from 'kue';

const newQueue = createQueue();

const notification = {
  phoneNumber: '91414485',
  message: 'verifification message'
};

const job = newQueue.create('push_notification_code', notification).save((err) => {
  if (!err) console.log(`Notification job created: ${job.id}`);
});

job.on('complete', () => {
  console.log('Notification job completed');
});
job.on('failed', (err) => {
  console.log('Notification job failed');
});
