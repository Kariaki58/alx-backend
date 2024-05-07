const createPushNotificationsJobs = (jobs, queue) => {
    if (!Array.isArray(jobs)) {
      throw Error('Jobs is not an array');
    }
  
    jobs.forEach((data) => {
      const queueJob = queue.create('push_notification_code_3', data);
  
      queueJob.on('complete', function () {
        console.log(`Notification job ${queueJob.id} completed`);
      }).on('failed', function (error) {
        console.log(`Notification job ${queueJob.id} failed: ${error}`);
      }).on('progress', function (progress, data) {
        console.log(`Notification job ${queueJob.id} ${progress}% complete`);
      });
      queueJob.save((err) => {
        if (!err) console.error(`Notification job created: ${queueJob.id}`);
      });
    });
  }
  
  module.exports = createPushNotificationsJobs;
  