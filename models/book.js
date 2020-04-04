const mongoose = require("mongoose")
const coverImageName = 'uploads/bookCovers'

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },    
    publishedDate: {
        type: Date,
        required: true
    },
    pageCount: {
        type: Number,
        required: true
    },    
    coverImageName: {
        type: String,
        required: true
    },
    description: {
        type: String
    },    
    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Author'
    },
    createdAt: {
        type: Date,
        require: true,
        default: Date.now
    }
})

module.exports =   mongoose.model("Book", bookSchema)
module.exports.coverImageName = coverImageName