const mongoose = require("mongoose")
const Book = require('./book')

const authorSchema = new mongoose.Schema({
    name: {
    type: String,
    required: true
    }
})

authorSchema.pre('remove', function(next) {
    Book.find({author: this.id}, (error, books) =>{
        if(error){
            console.log(" error " + error)
            next(error)
        }else if(books.length > 0){
            console.log(" inside books lenght "+"This author can't be deleted, as book still associated with him")
            next(new Error("This author can't be deleted, as book still associated with him"))
        }else {
            console.log(" next()")
            next()
        }
    })
})

module.exports =   mongoose.model("Author", authorSchema)
