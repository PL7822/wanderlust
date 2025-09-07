const geocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient =  mbxGeocoding({ accessToken: mapToken});

//index collback
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};



//New form callback
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}


//Show listing callback
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: 'reviews',
            populate: {
                path: "author"
            }
        })
        .populate('owner');
    if (!listing) {
        req.flash('error', 'Listing you requested does not exist!');
        return res.redirect('/listings');
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
}


//Create Listing callback 
module.exports.createListing = async (req, res, next) => {


  let response = await geocodingClient.forwardGeocode({
    query: req.body.Listing.location,  // small l
    limit: 1,
})
.send();

  let url =  req.file.path;
  let filename = req.file.filename;

    const listingData = {
        ...req.body.Listing,
        image: {
            filename: req.body.Listing.image?.filename || "listingimage",
            url: req.body.Listing.image?.url || "https://images.unsplash.com/photo-1602391833977-358a52198938?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzJ8fGNhbXBpbmd8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&w=800&q=60"
        }
    };

    const newListing = new Listing(listingData);
    newListing.owner = req.user._id;
    newListing.image = {url,filename}

    newListing.geometry = response.body.features[0].geometry;

    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash('success', 'Successfully made a new listing!');
    res.redirect('/listings');
}


//Edite Listing Form 
module.exports.renderEditeForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    if (!listing) {
        req.flash('error', 'Listing you requested does not exist!');
        return res.redirect('/listings');
    }
    let originalImageUrl = listing.image.url;
     originalImageUrl = originalImageUrl.replace("/upload","/upload/,w_200")
    res.render("listings/edit.ejs", { listing, originalImageUrl });
}


//Update Listing callback
module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(
        id,
        { ...req.body.Listing },
        { runValidators: true, new: true }

    );
    if (typeof req.file !=="undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename}
    await listing.save();
}
    req.flash('success', 'Successfully updated listing!');
    res.redirect(`/listings/${listing._id}`);
}

//Delete Listing callback
module.exports.deletelisting = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'deleted listing!');
    res.redirect('/listings');
}