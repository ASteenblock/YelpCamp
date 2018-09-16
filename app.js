//REQUIREMENTS
var express       =   require("express"),
    app           =   express(),
    bodyParser    =   require("body-parser"),
    mongoose      =   require("mongoose"),
    flash         =   require("connect-flash"),
    passport      =   require("passport"),
    LocalStrategy =   require("passport-local"),
    methodOverride =  require("method-override"),
    Campground    =   require("./models/campground"),
    seedDB        =   require("./seeds"),
    User          =   require("./models/user"),
    Comment       =   require("./models/comment");

//REQUIRING ROUTES
var commentRoutes     = require("./routes/comments"),  
    campgroundRoutes  = require("./routes/campgrounds"),
    indexRoutes       = require("./routes/index");

//SEED INITIAL DATA
// seedDB();

// connect to the DB - (port number has been removed for security purposes)
let url = process.env.DATABASEURL || "mongodb://localhost/yelp_camp_v13"; // fallback in case global var not working
mongoose.connect(url, {useMongoClient: true});

//APP CONFIG
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

// PASSPORT CONFIG
app.use(require("express-session")({
    secret: process.env.SESSIONSECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Pass currentUser to all routes
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error     = req.flash("error");
    res.locals.success     = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);
app.use("/campgrounds", campgroundRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
   console.log("The YelpCamp Server Has Started!");
});