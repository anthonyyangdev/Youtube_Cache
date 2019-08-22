const app = require('express')()
const countries = require('./Countries/index')
const { status, getVideos } = require('./VideoCache/index')
const cors = require('cors')
const bodyParser = require('body-parser')


app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.get('/', (req, res) => {
  res.send('<h1>Welcome</h1><p>This server contains data on the most popular YouTube videos.</p>')
})

app.get('/status', (req, res) => {
  status()
  res.send('<h1>Status: Looks Good</h1><p>This server contains data on the most popular YouTube videos.</p>')
})

app.get('/videos', (req, res) => {
  console.log(req.body)
  const body = req.body
  const host = body.host
  const countries = body.countries
  const videos = getVideos(host, countries)
  res.send({ videos })
})

app.listen(process.env.PORT || 3000, () =>
  console.log(`Example app listening on port ${process.env.PORT}!`),
);