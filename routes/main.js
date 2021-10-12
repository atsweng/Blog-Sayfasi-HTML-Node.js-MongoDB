const express = require('express')
const session = require('express-session')
const Post = require('../models/Post')
const router = express.Router()
const Category = require('../models/Category')
const User = require('../models/User')

router.get('/', (req, res) => {
  console.log(req.session)
  res.render('site/index')
})

router.get('/blog', (req, res) => {

  const postPerPage =4  //sayfa başına gönderi sayısı
  const page = req.query.page || 1
  Post.find({}).populate({path:'author',model:User }).lean().sort({$natural:-1})
      .skip((postPerPage*page)-postPerPage)
      .limit(postPerPage)
      .then(posts => {

        Post.countDocuments().lean().then(postCount =>{
          Category.aggregate([
            {
              $lookup:{
                from: 'posts',
                localField:'_id',
                foreignField:'category',
                as:'posts'
              }
            },
            {
              $project: {
                _id:1,
                name: 1,
                num_of_posts:{$size:'$posts'}
              }
            }
          ]).then(categories => {
            res.render('site/blog',{
              posts:posts, categories:categories,
              current:parseInt(page), 
              pages:Math.ceil(postCount)/postPerPage })
          })
        })
    })
  }) 


router.get('/contact', (req, res) => {
  res.render('site/contact')
})

module.exports = router


router.get('/blog', (req, res) => {
  Post.find({}).lean().sort({$natural:-1}).then(posts => {
    Category.find({}).lean().then(categories => {
      res.render('site/blog',{posts:posts, categories:categories})
    })
  })
})
