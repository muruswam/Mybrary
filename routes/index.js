const express = require('express')
const Book = require('../models/book')
const router = express.Router()

router.get('/', async (req, res) => {
    try {
        let  books = await Book.find().sort({createdAt: 'desc'}).limit(5).exec()
        res.render("index.ejs", {'books': books})
    }
    catch(err){
        res.render("index.ejs", {'books': books, "isErrorMessage": err})
    }
})

module.exports = router