const express = require('express')
const query = require('express/lib/middleware/query')
const func = require('./backend/main')
const server = express()

server.set('view engine', 'ejs')

const port = process.env.PORT

server.use(express.static('public'))

server.get('/', (req,res) => {
  const page = req.query.page || 1
  const wpg = "?"
  func.render_home(res,page,wpg)
})

server.get('/view', (req,res) => {
  const page = req.query.page || 1
  const wpg = "?"
  func.render_home(res,page,wpg)
})
server.get('/latest', (req,res) => {
  const page = req.query.page || 1
  const wpg = "latest/?"
  func.render_home(res,page,wpg)
})

server.get('/search', (req,res) => {
  const page = req.query.page || 1
  const wpg = `search?q=${req.query.q}&`
  func.render_home(res,page,wpg)
})

server.get('/view/:animeID', (req,res) => {
  get_id = req.params.animeID
  func.render_vPage(res,get_id)
})
server.use(function(req,res){
  	res.status(404).render('404')
})

server.listen(port, () => {
  console.log(`http://localhost:${port}`)
} )
