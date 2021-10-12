const mongoose = require('mongoose')

const Post=require('./models/Post')

mongoose.connect('mongodb://127.0.0.1/proje_test_db',{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

Post.create({
    title:'post başlığım',
    content: 'Post içeriği test',
}, (error,post)=>{
    console.log(error,post)
})
