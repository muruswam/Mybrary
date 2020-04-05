const express = require('express')
const bookRouter = express.Router()
const path = require('path')
const fs = require('fs')
const Book = require("../models/book")
const Author = require("../models/author")
const multer = require('multer')
const uploadPath = path.join('public', Book.coverImageName)
const fileTypes = ['image/jpeg', 'image/png', 'image/gif']
const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, fileTypes.includes(file.mimetype))
    }
})


bookRouter.get('/', async (req, res) => {
    let books = []
    try {
        let query = Book.find()
        if(req.query.title != null && req.query.title != ''){
            query = query.regex('title', new RegExp(req.query.title, "i"))
        }

        if(req.query.publishedBefore != null && req.query.publishedBefore != ''){
            query = query.lte('publishedDate', req.query.publishedBefore)
        }

        if(req.query.publishedAfter != null && req.query.publishedAfter != ''){
            query = query.gte('publishedDate', req.query.publishedAfter)
        }

        books = await  query.exec()
        res.render('book/index', { 'books': books})        
    }catch(err){
        res.render('book/index', { 'books': books, 'errorMessage': err})        
    }
})

bookRouter.get('/new', async (req, res) => {

    const book = await Book.find({})
    console.log(book)

    renderBooks(res, new Book())
})

bookRouter.post('/', upload.single('cover'), async (req, res) => {
            const fileName = req.file ? req.file.filename : null;

            let book = new Book({
                title: req.body.title,    
                publishedDate: new Date(req.body.publishedDate) ,
                pageCount: req.body.pageCount,    
                coverImageName: fileName,
                description: req.body.description,    
                author: req.body.author    
            })

            try {
                var  newBook = await book.save()
                res.redirect('/books')
            }catch(err){

                if(book.coverImageName != null)
                removeBookCover(book.coverImageName)

                renderBooks(res, book, true)
            }
})

function removeBookCover(imagePath){
    fs.unlink(path.join(uploadPath, imagePath), err => {
        if(err) console.error(" error in deleting files ," + err)
    })
}

async function renderBooks(res, book, isError = false){
    try {
        const authors = await Author.find({})
        const book = new Book()
        let params = {
            authors: authors,
            book: book
        }

        if(isError == true)
        params['errorMessage'] = 'Error in creating new book'

        res.render("book/new", params)
    }catch(err){
        res.redirect("/books")
    }
}

module.exports = bookRouter