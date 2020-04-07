const express = require('express')
const bookRouter = express.Router()
const path = require('path')
//const fs = require('fs')
const Book = require("../models/book")
const Author = require("../models/author")
//const multer = require('multer')
//const uploadPath = path.join('public', Book.coverImageName)
const fileTypes = ['image/jpeg', 'image/png', 'image/gif']
/*const upload = multer({
    dest: uploadPath,
    fileFilter: (req, file, callback) => {
        callback(null, fileTypes.includes(file.mimetype))
    }
})*/


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

    renderBooks(res, new Book(), 'new')
})

bookRouter.post('/', /*upload.single('cover'),*/ async (req, res) => {
            //const fileName = req.file ? req.file.filename : null;

            let book = new Book({
                title: req.body.title,    
                publishedDate: new Date(req.body.publishedDate) ,
                pageCount: req.body.pageCount,
                description: req.body.description,    
                author: req.body.author    
            })
            saveBookCover(book, req.body.cover)
            try {
                var  newBook = await book.save()
                res.redirect('/books')
            }catch(err){

                /*if(book.coverImageName != null)
                removeBookCover(book.coverImageName)*/

                renderBooks(res, book, 'new', true)
            }
})

bookRouter.get('/:id', async (req, res) => {
    try{
    const book = await Book.findById(req.params.id)
                           .populate('author')
                           .exec()
    console.log(book)
    res.render('book/view', {'book': book})
    }catch(e){
        res.redirect("/books")
    }
})

bookRouter.get('/:id/edit', async (req, res) => {
    try{
    const book = await Book.findById(req.params.id)
    console.log(book)
    await renderBooks(res, book, 'edit')
    }catch(e){
        res.redirect("/books")
    }
})

bookRouter.put('/:id', async (req, res) => {
    
    let book = null;
    try{
    book = await Book.findById(req.params.id)
    console.log(book)
    
    book.title  =  req.body.title    
    book.publishedDate = new Date(req.body.publishedDate) 
    book.pageCount = req.body.pageCount
    book.description = req.body.description    
    console.log("author get" + req.body.author )
    book.author = req.body.author   
    if(req.body.cover != null && req.body.cover != '')
    saveBookCover(book, req.body.cover)
    await book.save()
    res.render(`book/view`, {'book': book})
    }catch(e){
        if(book != null ){
            res.render('book/edit', {'book': book, "errorMessage": "Error in updating book  "+e})
        }else {
            res.redirect("/books")
        }
        
    }

})

bookRouter.delete('/:id', async (req, res) => {
    try{
    const book = await Book.findById(req.params.id)
    console.log(book)
    await book.remove();
    res.redirect("/books")
    }catch(e){
        if(book != null){
            res.render('book/view', {
                'book': book,
                'errorMessage': 'Could not remove book, cause   - ' + e
            })
        }else {
            res.redirect("/")
        }
    }
})

function saveBookCover(book, enc){
            if(enc == null) return;
            let cover = JSON.parse(enc)
            if(cover != null &&   fileTypes.includes(cover.type)){
                book.coverImage = new Buffer.from(cover.data, 'base64');
                book.coverImageType = cover.type;

            }
}

/*function removeBookCover(imagePath){
    fs.unlink(path.join(uploadPath, imagePath), err => {
        if(err) console.error(" error in deleting files ," + err)
    })
}*/

async function renderBooks(res, book, viewName,  isError = false){
    try {
        const authors = await Author.find({})
        
        let params = {
            authors: authors,
            book: book
        }

        if(isError == true){
            if(viewName == 'new')
            params['errorMessage'] = 'Error in creating new book'
            else
            params['errorMessage'] = 'Error in updating new book'
        }
        

        res.render(`book/${viewName}`, params)
    }catch(err){
        console.err("errr               -> "+params)
        res.redirect('/')
    }
}

module.exports = bookRouter