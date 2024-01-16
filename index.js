if(process.env.NODE_ENV !="production"){
    require('dotenv').config();
}

const express=require("express");
const app=express();
const path=require("path");
const mongoose=require("mongoose");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
const userRouter=require("./routes/user.js");
const { error } = require('console');
const dbUrl=process.env.ATLASDB_URL; 
// const MONGO_URL="mongodb://127.0.0.1:27017/travel";
main()
.then(()=>{
console.log("MongoDb is successfully connected");
})
.catch((err)=>{
console.log(err);
});
async function main(){
    // await mongoose.connect(MONGO_URL);
    await mongoose.connect(dbUrl);
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req,res)=>{
    console.log("Root is working");
    res.send("Root is working");
    });

    app.get("/demouser",async(req,res)=>{
        let fakeUser=new User({
            email:"az@gmail.com",
            username:"Zoiz",
        });
       let registereduser=await User.register(fakeUser,"hellocode");
       console.log(registereduser);
    })
    const store=MongoStore.create({
        mongoUrl:dbUrl,
        crypto:{
            secret:process.env.SECRET,
        },
        touchAfter:24*3600,
    });
    store.on("error",()=>{
        console.log("ERROR IN MONGOSTORE!",error);
    })
const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,

    }
};
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());    

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.curruser=req.user;
    next();
})

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",userRouter);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"PAGE NOT FOUND !"));
});

app.use((err,req,res,next)=>{
let{statusc="500",message="Something went wrong"}=err;
res.status(500).render("error.ejs",{message});

});

app.listen(6009,()=>{
console.log("Server is listening to port");
});




