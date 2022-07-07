const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const { isEmpty,uploadDir } = require('../../helpers/upload-helper');
const fs = require('fs');
const Category = require('../../models/Category');
const {userAuthenticated} = require('../../helpers/authentication');
 

router.all('/*',(req,res,next)=>{
    res.app.locals.layout = 'admin';
    next();
});


router.get('/my-posts',(req,res)=>{
    Post.find({user: req.user.id})
    .populate('category')
    .then(posts =>{
        // console.log(posts);
        res.render('admin/posts/my-posts',{posts:posts});
    });
});

router.get('/',(req,res,next)=>{

    Post.find({})
    .populate('category')
    .then(posts =>{
        res.render('admin/posts/',{posts:posts});
    })


});



router.get('/edit/:id',(req,res)=>{

    Post.findOne({_id: req.params.id}).then(post =>{

        Category.find({}).then(categories =>{
            res.render('admin/posts/edit',{post:post,categories:categories});
        })

    })

});



router.get('/create',(req,res,next)=>{

    Category.find({}).then(categories =>{
        res.render('admin/posts/create',{categories:categories});
    })

});


router.post('/create',(req,res,next)=>{

let file;
let filename;
    if(!isEmpty(req.files)){

         file = req.files.file;
         filename = Date.now() + file.name;
    
        let dirUploads = './public/uploads/';
    
        file.mv(dirUploads + filename, (err)=>{
            if(err) throw err;
        });

    }

    let allowComments=true;
    if(req.body.allowComments)
    {
        allowComments=true;
    }else{
        allowComments=false;
    }

   const newPost = new Post({
        user: req.user.id,
        title: req.body.title,
        status: req.body.status,
        allowComments: allowComments,
        body: req.body.body,
        file: filename,     
        category:req.body.category
    });

    newPost.save().then(savedPost =>{

        // console.log(savedPost);

        req.flash('success_message', `post ${savedPost.title} was created successfully`);
        res.redirect('/admin/posts');

    });
});
// console.log(req.files);


router.put('/edit/:id',(req, res)=>{
 
    Post.findOne({_id: req.params.id}).then(post =>{

        if(req.body.allowComments)
        {
            allowComments=true;
        }else{
            allowComments=false;
        }
        post.user = req.user.id;
        post.title= req.body.title;
        post.status= req.body.status;
        post.allowComments= allowComments;
        post.body= req.body.body;
        post.category=req.body.category;

        if(!isEmpty(req.files)){

            file = req.files.file;
            filename = Date.now() + file.name;
            post.file = filename;
           let dirUploads = './public/uploads/';
       
           file.mv(dirUploads + filename, (err)=>{
               if(err) throw err;
           });
   
       }

        post.save().then(updatedPost => {


        req.flash('success_message', `post updated successfully`);

            res.redirect('/admin/posts/my-posts');
        });
    });

});


router.delete('/:id',(req,res)=>{

    Post.remove({_id: req.params.id})
        .then(result =>{

            req.flash('success_message', `post deleted successfully`);
            res.redirect('/admin/posts');
        });

});


// router.delete('/:id',(req,res)=>{
//     Post.findOne({_id: req.params.id})
//     .populate('comments')
//         .then(post =>{
//             fs.unlink(uploadDir + post.file,(err)=>{
               
//                 if(!post.comments.length < 1)
//                 {
//                     post.comments.forEach(comment =>{
//                         comment.remove();
//                     });
//                 }
//                 post.remove().then(postRemoved =>{
//                     req.flash('success_message','Post deleted successfully');
//                     res.redirect('/admin/posts/my-posts');   

//                 })

//             });

//         });
// });





module.exports = router;
