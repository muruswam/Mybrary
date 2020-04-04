const express = require('express')
const authorRouter = express.Router()
const Author = require("../models/author")


authorRouter.get('/', async (req, res) => {
    try {
    let searchCriteria = {}
    if(req.query.name != null && req.query.name != ''){
        searchCriteria.name = new RegExp(req.query.name, 'i')
    }
    const authors = await Author.find(searchCriteria)
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

module.exports = authorRouter