if(process.env.NODE_ENV !== 'production')
require('dotenv').config()

const  express = require("express")
const app = express()

const expressLayout = require("express-ejs-layouts")
const indexRouter = require('./routes/index')
const authorRouter = require('./routes/author')
const bookRouter = require('./routes/book')
const mongooseDB = require('mongoose')
const bodyParser = require('body-parser')
const methodoverride = require('method-override')
const path = require('path')
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
app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({limit: "10mb", extended: false}))
app.use(methodoverride('_method'))
app.use('/', indexRouter)
app.use('/authors', authorRouter)
app.use('/books', bookRouter)


app.listen(process.env.SERVER_PORT || 3000)