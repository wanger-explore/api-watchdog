const express = require('express')
const { robotList, robotDetail, robotGroupList, robotGroupDetail } = require('./data')

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const app = express()
const port = 3020

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/ping', (req, res) => {
  res.send('pong')
})

app.get('/v3/robots', async (req, res) => {
  await sleep(1000)
  res.send(robotList)
})

app.get('/v3/robots/:id', async (req, res) => {
  await sleep(1000)
  res.send(robotDetail)
})

app.get('/v3/robot/groups', async (req, res) => {
  await sleep(1000)
  res.send(robotGroupList)
})

app.get('/v3/robot/groups/:id', async (req, res) => {
  await sleep(1000)
  res.send(robotGroupDetail)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})