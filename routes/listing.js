const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require('../models/listing.js');
const { isLoggedIn, isOwner, validatelisting } = require('../middleware.js');
const listingController = require("../controllers/listings.js");
const multer = require('multer');
const { storage } = require("..//cloudConfig.js");
const upload = multer({ storage });
//index & create route
router
    .route("/")
    .get(wrapAsync(listingController.index))

    .post(
        isLoggedIn,
        validatelisting,
        upload.single("listing[image]"),
        wrapAsync(listingController.createListing)
    );

//new route
router.get('/new', isLoggedIn, listingController.renderNewForm);


//Show , Update & Delete Route 
router
    .route("/:id")

    .get(
        wrapAsync(listingController.showListing)
    )

    .put(
        isLoggedIn,
        isOwner,
        validatelisting,
         validatelisting,
        upload.single("Listing[image]"),
        wrapAsync(listingController.updateListing)
    )

    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingController.deletelisting)
    );

//Edit Route
router.get('/:id/edit',
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.renderEditeForm)
);

module.exports = router;