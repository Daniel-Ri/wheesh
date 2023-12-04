require("dotenv").config();
const express = require('express')
const cors = require('cors');
const app = express()
const port = process.env.PORT;
// const router = require('./router/index')

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended : false}))
// app.use('/api/', router);
app.use('/api/public', express.static('public'))

app.get("/", async (req, res) => {
  res.send("Hello, wheesh's client!");
});

app.all('*', (req, res) => {
  res.status(404).json({ message: 'API Not Found' })
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
