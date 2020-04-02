if(process.env.NODE_ENV !== 'production')
require('dotenv').config()

const  express = require("express")
const app = express()

const expressLayout = require("express-ejs-layouts")
const indexRouter = require('./routes/index')
const mongooseDB = require('mongoose')
mongooseDB.connect(process.env.DATABASE_URL, { 
    useNewUrlParser: true
})
const db = mongooseDB.connection

db.on('error', error => console.error(error))
db.once('open', () => console.info('db connected'))


app.set('view engine', 'ejs')
app.set('views', __dirname+"/views")
app.set('layout', 'layouts/layout')
app.use(expressLayout)
app.use(express.static('public'))




app.use('/', indexRouter)

app.listen(process.env.SERVER_PORT || 3000)