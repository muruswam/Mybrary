const mongoose = require("mongoose")
const coverImageName = 'uploads/bookCovers'
//const path = require('path')

//const uploadPath = 'uploads/bookCovers'

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
    coverImage: {
        type: Buffer,
        required: true
    },
    coverImageType: {
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

bookSchema.virtual('coverImagePath').get(function(){
    
    /*if(this.coverImageName != null){
        return path.join('/', uploadPath, this.coverImageName)
    }*/

    if(this.coverImage != null && this.coverImageType !=null ){
        return `data:${this.coverImageType};charset=UTF-8;base64,${this.coverImage.toString('base64')}`
    }
})

module.exports =   mongoose.model("Book", bookSchema)
//module.exports.coverImageName = coverImageName