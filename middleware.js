const Listing = require('./models/listing');
const Review = require('./models/review.js');
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require('./schema.js');


//middleware to check if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
};

//middleware to save the redirect url in locals for use in templates
module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};


//middleware to check if the current user is the owner of the listing
module.exports.isOwner = async (req, res, next) => {

    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(res.locals.currentUser._id)) {
        req.flash('error', 'You are not the owner of this listing !');
        return res.redirect(`/listings/${id}`);
    }
    next();
}

//middleware to validate the listing data using Joi schema
module.exports.validatelisting = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        throw new ExpressError(400, error);
    } else {
        next();
    }
}

//middleware to validate the review data using Joi schema
module.exports.validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(',')
        throw new ExpressError(400, error);
    } else {
        next();
    }
}

 
module.exports.isReviewAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(res.locals.currentUser._id)) {
        req.flash('error', 'You are not the author of this review !');
        return res.redirect(`/listings/${id}`);
    }
    next();
}