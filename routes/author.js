const express = require('express')
const authorRouter = express.Router()
const Author = require("../models/author")
const Book = require('../models/book')


authorRouter.get('/',  async (req, res) => {
    try {
    const authors =  await getAuthors(req);   
    res.render("author/index.ejs", { authors: authors})

    }
    catch(err){
        if(err){
            res.render("author/index.ejs" , {
                errorMessage: err
            })
        }
    }
})

authorRouter.get('/new', (req, res) => {
    res.render("author/new.ejs")
})

authorRouter.post('/',  async (req, res) => {
    try {
        const author = new Author({
            name: req.body.name
        });

        const newAuthor = await author.save()
        res.redirect("/authors")
    }
    catch(err){
        if(err){
            res.render("author/new.ejs" , {
                errorMessage: err,
                author: req.body.name
            })   
        }
    }
})

authorRouter.get('/:id', async (req, res) => {
    try {
    const author = await Author.findById(req.params.id)
    //const books = await Book.find({author: author.id}).limit(2)
    const books = await Book.find({author: author.id})
    res.render("author/view" , {'id': req.params.id, 'name': author.name, 'books': books})
    }catch(e){
        console.log(e)
        res.redirect("/")
    }
})

authorRouter.get('/:id/edit', async (req, res) => {

    const author = await Author.findById(req.params.id)

    res.render("author/edit" , {'id': req.params.id, 'name': author.name})
})

authorRouter.put('/:id', async (req, res) => {
    
    //res.send(req.body.name+" ---update author--- " + req.params.id)    
    
    try {
        const author = await Author.findById(req.params.id)
        if(author == null ) {
            res.render("author/edit", {"errorMessage": "Update failed !!!", 'id': req.params.id, 'name': req.body.name})
        }
        if(req.body.name == null ){
            res.render("author/edit", {"errorMessage": "Update failed, Name should not be empty !!!", 'id': req.params.id, 'name': req.body.name})
        }

        author.name = req.body.name

        let updatedAuthor = await author.save()
        res.redirect("/authors")

    }catch(err){
        res.render("author/edit", {"errorMessage": "Update failed !!!"+err, 'id': req.params.id, 'name': req.body.name})
    }

    
})

authorRouter.delete('/:id', async (req, res) => {
    let authors = await getAuthors(req)
    try {
        const author = await Author.findById(req.params.id)
        if(author == null ) {
            
            res.render("author/index", {"errorMessage": "Delete Failed, Author Not Found", 'authors': authors})
        }     

        let updatedAuthor = await author.remove(/*(error, author) => {
            if(error){
                console.log('inside error callback')
                
                return res.render("author/index", {"errorMessage": "Delete Failed: "+error,  'authors': authors})
            }
        }*/)
        let authors = await getAuthors(req)
        console.log('inside edn of delete')
        res.render("author/index",  {"errorMessage": "Deleted Successfully.",  'authors': authors})
        
    }catch(err){
        
        res.render("author/index", {"errorMessage": "Delete Failed: "+err, 'authors': authors})
    }

})

 async function getAuthors(req){
    let searchCriteria = {}
    if(req.query.name != null && req.query.name != ''){
        searchCriteria.name = new RegExp(req.query.name, 'i')
    }
    const authors =  await Author.find(searchCriteria)

    return authors;
}

module.exports = authorRouter