const express = require('express');
const router = express.Router();
const Post = require('../../models/Post');
const Category = require('../../models/Category');
const User = require('../../models/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;


router.all('/*',(req,res,next)=>{
    res.app.locals.layout = 'home';
    next();
});

router.get('/',(req,res) => {

    // const perPage = 10;
    // const page = req.query.page || 1;


    Post.find({})
    .then(posts=>{

        Post.countDocuments().then(postCount =>{

            Category.find({}).then(categories=>{
                res.render('home/index',{
                    posts:posts,
                    categories:categories
                });           //home->index in views dynamic data of layout home
            });
        });
    });
});

router.get('/about',(req,res) => {
    res.render('home/about');
});

router.get('/login',(req,res) => {
    res.render('home/login');
});



//login 

passport.use(new LocalStrategy({usernameField: 'email'},(email,password,done) => { 
     
    User.findOne({email: email}).then(user =>{
        if(!user)   return done(null,false,{message: 'no user found'});
        bcrypt.compare(password,user.password,(err,matched) =>{
            if(err) return err;

            if(matched){
                return done(null,user);
            }else{
                return done(null,false,{message: 'Incorrect password !'});
            }
        });

    });
    
}));


passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
  



router.post('/login',(req,res,next) => {
    
    passport.authenticate('local',{                 // using local strategy

        successRedirect: '/admin',
        failureRedirect: '/login',
        failureFlash: true
        
    })(req,res,next);
});


router.get('/logout',(req,res)=>{
    req.logOut();
    res.redirect('/login');
})



router.get('/register',(req,res) => {
    res.render('home/register');
});


router.post('/register',(req,res) => {
    

        User.findOne({email: req.body.email}).then(user => {
        if(user){

            req.flash('error_message','email already exists');
            res.redirect('/register');
        }
        else
        {

            const newUser = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email:req.body.email,
                password:req.body.password,
                profession: null,
                bio: null,
                address: null,
                degree: null,
                course: null,
                phone: null,
                altEmail: null,
                behaviour: null,
                teamwork: null,
                time:null,
                file:null,
                communication: null,
                des: null
            });
            
          

                bcrypt.genSalt(10,(err, salt) => {
                    bcrypt.hash(newUser.password,salt, (err,hash) => {
                        newUser.password =hash;
                        newUser.save().then(savedUser =>{
                            
                            req.flash('success_message','Successfully Registered, now login');

                            res.redirect('/login');
                        });
                    })
                })
    


        }
    })
    


        
});


router.get('/post/:id',(req,res) => {

    Post.findOne({_id: req.params.id}).populate({path: 'comments',match:{approveComment:true},populate: {path: 'user', model: 'users'}})
    .populate('user')
    .then((post) => {

        Category.find({}).then((categories) => {
            res.render('home/post',{post:post,categories:categories});
        });

        });


});



module.exports = router;