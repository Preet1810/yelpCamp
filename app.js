if (process.env.NODE_ENV!=="production") {
    require('dotenv').config();
}
// require('dotenv').config();


const express=require('express');
const path=require('path');
const mongoose=require('mongoose');
const ejsMate=require('ejs-mate');
const session=require('express-session');
const flash=require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user');
const helmet=require('helmet'); //comes with a lot of security headers 

const mongoSanitize=require('express-mongo-sanitize');  //resolves security issue related to mongodb

const ExpressError=require('./utils/ExpressError');
const methodOverride=require('method-override');

const userRoutes=require('./routes/users');
const campgroundRoutes=require('./routes/campground');
const reviewRoutes=require('./routes/reviews');

const MongoDBStore=require('connect-mongo');

const dbUrl=process.env.DB_URL||'mongodb://localhost:27017/yelp-camp'

// mongodb://localhost:27017/yelp-camp
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db=mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app=express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.engine('ejs', ejsMate);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// To remove data using these defaults:
app.use(mongoSanitize());

const secret=process.env.SECRET||'thisshouldbeabettersecret!'

const store=MongoDBStore.create({
    mongoUrl: dbUrl,
    secret,                              //we are deploying on mongo atlas
    touchAfter: 24*60*60  //seconds
})

store.on("error", function (e) {
    console.log('session store error', e)
})

const sessionConfig={
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure:true,
        expires: Date.now()+1000*60*60*24*7, //cookie will expire in a week
        maxAge: 1000*60*60*24*7   //milisecond
    }
}
app.use(session(sessionConfig))
app.use(flash());
app.use(helmet());  //{ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }

//these all are scripts that we are specifying to Content Security Policy of helmet to allow the usage of it
const scriptSrcUrls=[
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/dv5vm4sqh/"
];
const styleSrcUrls=[
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/dv5vm4sqh/"
];
const connectSrcUrls=[
    "https://*.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://events.mapbox.com",
    "https://res.cloudinary.com/dv5vm4sqh/"
];

const fontSrcUrls=[];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],            //configuring helmet here 
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dwh4llt0c/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
app.use(express.static(path.join(__dirname, 'public')))



passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {

    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})

app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)







app.get('/', (req, res) => {
    res.render('campgrounds/home')
})





app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})


app.use((err, req, res, next) => {
    const { statusCode=500 }=err;
    if (!err.message) err.message='Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})
const port=process.env.PORT||3000;
app.listen(port, () => {
    console.log(`Listening to Port ${port}`)         //deploying on heroku, we are taking port number from heroku
})

// app.listen(3000, () => {
//     console.log('Listening to Port 3000')
// }) 