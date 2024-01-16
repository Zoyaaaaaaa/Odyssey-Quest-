const Listing = require("./models/listing");

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        //redirectURL
    
        req.flash("error","You must login to create listing");
        res.redirect("/login");
       }
       next();
};

// module.exports.saveRedirectUrl=(req,res,next)=>{
//     if(req.session.redirectUrl){
//         res.locals.redirectUrl=req.session.redirectUrl;

//     }
//     next();
// }

module.exports.isOwner=async (req,res,next)=>{
    let{id}=req.params;
    let listing=Listing.findById(id);
    if(!listing.owner.equals(res.locals.curruser._id)){
        req.flash("You dont have permission to edit");
        return res.redirect(`/lsting/${id}`);
    }
    next();
}