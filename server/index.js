require("dotenv").config();
const express = require('express')
const cron = require('node-cron');
const cors = require('cors');
const app = express()
const port = process.env.PORT;
const router = require('./routes/index');
const { deleteNotPaidOrderPassedDueTime, remindUserBeforeOneHourOfDeparture, addDailyData } = require("./utils/handleJob");

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended : false}))
app.use('/api/', router);
app.use('/api/public', express.static('public'))

app.get("/", async (req, res) => {
  res.send("Hello, wheesh's client!");
});

app.all('*', (req, res) => {
  res.status(404).json({ message: 'API Not Found' })
});

cron.schedule('* * * * *', async () => {
  console.log('Job running every minute.');
  await deleteNotPaidOrderPassedDueTime();
  await remindUserBeforeOneHourOfDeparture();
});

cron.schedule('1 0 0 * * *', async () => {
  console.log('Job running every midnight.');
  await addDailyData();
}, {
  scheduled: true,
  timezone: "Asia/Jakarta"
});

// Only start the server if this file is the main module
if (!module.parent) {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
}

module.exports = app;