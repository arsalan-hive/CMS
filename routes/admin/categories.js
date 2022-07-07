const express = require('express');
const router = express.Router();
const Category = require('../../models/Category');

router.all('/*',(req,res,next)=>{
    res.app.locals.layout = 'admin';
    next();
});


router.post('/create',(req,res) => {
    
        const newCategory = new Category({
            name:req.body.name
        });

        newCategory.save().then(savedCategory => {
            res.redirect('/admin/categories');     
        })


});
router.get('/',(req,res)=>{

    Category.find({}).then(categories =>{
        res.render('admin/categories/index',{categories:categories});
    });
});

router.delete('/:id',(req,res)=>{
    
    Category.remove({_id: req.params.id})
        .then(result => {
            req.flash('success_message', `Category deleted successfully`);
            res.redirect('/admin/categories');
        })
    });





router.get('/edit/:id',(req,res)=>{
    Category.findOne({_id: req.params.id})
        .then(category => {
            res.render('admin/categories/edit',{category:category});
        });
});

router.put('/edit/:id',(req,res)=>{
    Category.findOne({_id: req.params.id})
        .then(category => {
            category.name = req.body.name;
            category.save().then((savedCategory)=>{
                res.redirect('/admin/categories');
            })

        });
}); 

// router.get('/dashboard',(req,res) => {
//     res.render('admin/dashboard');           //home->index in views dynamic data of layout home
// });




module.exports = router;