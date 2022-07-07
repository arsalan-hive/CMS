const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const faker = require('faker');
const {userAuthenticated} = require('../../helpers/authentication');

router.all('/*',(req,res,next)=>{
    res.app.locals.layout = 'admin';
    next();
});


router.get('/',(req,res) => {

    Post.countDocuments({}).then(postCount =>{         //pull req for chart
        res.render('admin/index',{postCount:postCount});           //home->index in views dynamic data of layout home

    })



});

// router.get('/dashboard',(req,res) => {
//     res.render('admin/dashboard');           //home->index in views dynamic data of layout home
// });


// router.post('/generate-fake-posts',(req,res)=>{



//     for(let i=0;i<req.body.amount;i++)
//     {
//         let post = new Post();

//         post.title=faker.name.title();
//         post.status='public';
//         post.allowComments=faker.random.boolean();
//         post.body=faker.lorem.sentence();

//         post.save().then(savedPost=>{});

//     }
//     res.redirect('/admin/posts');

// })

module.exports = router;