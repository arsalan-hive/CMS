const express = require('express');
const app = express();
const path = require('path')
const exphbs= require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const upload = require('express-fileupload');
const session = require('express-session');
const flash = require('connect-flash');
const {mongoDbUrl} = require('./config/config');
const passport = require('passport');
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);


mongoose.Promise = global.Promise;

mongoose.connect(mongoDbUrl).then(db =>{

    console.log('MONGO CONNECTED');

}).catch(error => console.log('not connected'));


app.use(express.static(path.join(__dirname,'public')));


///////////////////////////////////////////

const {select,generateTime,paginate}=require('./helpers/handlebars-helpers');

const Handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const insecureHandlebars = allowInsecurePrototypeAccess(Handlebars);
 
app.engine('handlebars', exphbs({handlebars: allowInsecurePrototypeAccess(Handlebars),helpers:{select:select,generateTime:generateTime,paginate:paginate}}));
app.set('view engine', 'handlebars');


// upload middleware


//to upload files
app.use(upload());




//load view engine


// app.engine('handlebars',exphbs({defaultLayout:'home'}));
//     app.set('view engine','handlebars');


//Body parser

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//session

app.use(session({
    secret: 'arsalan',
    resave: true,
    saveUninitialized: true
  }));  

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());





// local variables using middleware
app.use((req, res,next)=>{

    res.locals.user = req.user || null;

    res.locals.success_message = req.flash('success_message');
    res.locals.error_message = req.flash('error_message');
    res.locals.error = req.flash('error');
    next();

});

//method-overrides

app.use(methodOverride('_method'));


//Load Routes
const home  = require('./routes/home/index');
const admin = require('./routes/admin/index');
const posts = require('./routes/admin/posts');
const categories = require('./routes/admin/categories');
const comments = require('./routes/admin/comments');
const profile = require('./routes/admin/profile');
//use Routes
app.use('/',home);
app.use('/admin',admin);
app.use('/admin/posts',posts);
app.use('/admin/categories',categories);
app.use('/admin/comments',comments);
app.use('/admin/profile',profile);

app.listen(4500,()=>{
    console.log('listening....');
});
