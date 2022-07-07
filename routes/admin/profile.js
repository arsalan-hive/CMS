const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const fs = require('fs');
const { isEmpty,uploadDir } = require('../../helpers/upload-helper');

router.all('/*',(req,res,next)=>{
    res.app.locals.layout = 'admin';
    next();
});

router.get('/:id',(req,res)=>{

    User.findOne({_id: req.params.id})
    .then(users =>{
        res.render('admin/profile/',{users:users});
    });
});

router.get('/',(req,res)=>{

    User.findOne({user: req.user.id})
    .then(users =>{
        res.render('admin/profile/',{users:users});
    });
});



router.get('/edit/:id',(req,res)=>{
    res.render('admin/profile/edit');
});



router.put('/edit/:id',(req, res)=>{
 

    User.findOne({_id: req.user.id}).then(user =>{
        user.profession = req.body.profession;
        user.bio = req.body.bio;
        user.address = req.body.address;
        user.degree = req.body.degree;
        user.course = req.body.course;
        user.phone = req.body.phone;
        user.altemail = req.body.altemail;
        user.behaviour = req.body.behaviour;
        user.teamwork = req.body.teamwork;
        user.communication = req.body.communication;
        user.time=req.body.time;
        user.file=req.body.file;
        user.desc=req.body.desc;

        if(!isEmpty(req.files)){

            let file = req.files.file;
            let filename = Date.now() + file.name;
            user.file = filename;
           let dirUploads = './public/uploads/profile/';
       
           file.mv(dirUploads + filename, (err)=>{
               if(err) throw err;
           });
   
       }

        user.save().then(userSaved => {

        req.flash('success_message', `profile updated successfully`);
            res.redirect('/admin');
            // res.redirect('/admin/profile/{{user.id}}');
        });
    });

});





module.exports = router;
