const User = require("../models/user")

// Signup Render  Form 
module.exports.renderSignupForm = (req, res) => {
    res.render("user/signup");
}


// Signup form  Route
module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        // login the user after signing up
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust !");
            res.redirect("/listings");
        });

    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
}


// login Render Form 
module.exports.renderLoginForm = (req, res) => {
    res.render("user/login");
}


// Login Form Route 
module.exports.login = async (req, res) => {
    req.flash("success", "Welcome back to Wanderlust !");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}


// Logout Route 
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "Logged you out !");
        res.redirect("/listings");
    })
}