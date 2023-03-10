import userModel from './user.model.js';
import AppError from '../../Utils/appErrors.js';
import cloudinary from 'cloudinary';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import confirmEmail from '../../Utils/confirmEmail.js';
import sendResetCodeToEmail from '../../Utils/sendResetCode.js';







// Configuration 
cloudinary.config({
    cloud_name: "dlkxomefh",
    api_key: "356392959747328",
    api_secret: "f5geHIFgWZ4godIs4MOB3Rb92kY"
});






// Function To Handle Errors

const ErrorHandler = (fun) => {

    return (req, res, next) => {

        fun(req, res, next).catch((err) => {

            return next(new AppError(err.message, 404));

        });

    };

};








// SignUp

export const signup = ErrorHandler(async (req, res, next) => {

    const user = await userModel.findOne({ email: req.body.email });


    if (user) {

        res.status(400).json({ message: "This Is User Already Exists" });

    } else {

        bcrypt.hash(req.body.password, 5, async function (err, hash) {

            req.body.password = hash;
            req.body.role = "user";


            if (req.file) {

                const cloud = await cloudinary.uploader.upload(req.file.path);
                req.body.profileImg = cloud.secure_url;

            };


            const token = jwt.sign({ email: req.body.email }, process.env.SECRET_KEY_SIGNUP);
            confirmEmail(req.body.email, token, req.protocol, req.headers.host);


            const newUser = new userModel(req.body);
            await newUser.save();


            res.status(200).json({ message: "Success", data: newUser });

        });

    };

});






// SignIn

export const signin = ErrorHandler(async (req, res, next) => {

    const user = await userModel.findOne({ email: req.body.email });


    if (user) {

        const match = await bcrypt.compare(req.body.password, user.password);

        if (match) {


            if (user.emailConfirm) {

                const token = jwt.sign({

                    id: user._id,
                    name: user.name,
                    email: user.email,
                    age: user.age,
                    emailConfirm: user.emailConfirm,
                    isActive: user.isActive,
                    phone: user.phone,
                    role: user.role,
                    profileImg: user.profileImg,

                }, process.env.SECRET_KEY_SIGNIN);

                res.status(200).json({ message: "Success", token });

            } else {

                res.status(400).json({ message: "Please Confirm Your Email Then Try Again" });

            };


        } else {

            res.status(400).json({ message: "Password Incorrect" });

        };

    } else {

        res.status(400).json({ message: `This Email: ${req.body.email} Doesn't Exists` });

    };

});








// Confirm Your Email

export const confirmation = ErrorHandler(async (req, res, next) => {

    const { token } = req.params;

    jwt.verify(token, process.env.SECRET_KEY_SIGNUP, async function (err, decoded) {


        if (err) {

            res.status(400).json({ message: "Invalid Token", err });

        } else {

            const user = await userModel.findOne({ email: decoded.email });

            if (user) {

                user.emailConfirm = true;
                await user.save();

                res.status(200).json({ message: "Successfully Email Confirmed" });

            } else {

                res.status(400).json({ message: "User Not Found" });

            };

        };


    });

});








// Authentication 

export const Authentication = ErrorHandler(async (req, res, next) => {

    const token = req.headers.token;

    jwt.verify(token, process.env.SECRET_KEY_SIGNIN, async function (err, decoded) {


        if (err) {

            res.status(400).json({ message: "Invalid Token", err });

        } else {

            const user = await userModel.findOne({ _id: decoded.id });

            if (user) {

                if (user.passwordChangedAt) {


                    if (user.passwordChangedAt > decoded.iat) {

                        const time = new Date(user.passwordChangedAt * 1000);
                        res.status(400).json({ message: `Password Changed At ${time}` });

                    } else {

                        req.user = user;
                        next();

                    };


                } else {

                    req.user = user;
                    next();

                };

            } else {

                res.status(400).json({ message: "User Not Found" });

            };

        };

    });

});







// Authorization

export const Authorization = (roles) => {

    return (req, res, next) => {

        if (roles.includes(req.user.role)) {

            next();

        } else {

            res.status(400).json({ message: "You Not Authorized To Do That" });

        };

    };

};






// Send Reset Code

export const sendResetCode = ErrorHandler(async (req, res, next) => {

    const user = await userModel.findOne({ email: req.body.email });


    if (user) {

        const randomCode = Math.floor((Math.random() * 1000000) + 1).toString();

        bcrypt.hash(randomCode, 5, async function (err, hash) {

            user.resetCode = hash;
            await user.save();

            sendResetCodeToEmail(randomCode, user.email, user.name);

            res.status(200).json({ message: "Success Send Reset Code", data: { id: user._id } });

        });

    } else {

        res.status(400).json({ message: `This Email: ${req.body.email} Doesn't Exists` });

    };

});






// Verify Reset Code

export const verifyResetCode = ErrorHandler(async (req, res, next) => {

    const id = req.headers.id;
    const user = await userModel.findOne({ _id: id });

    if (user) {

        const match = await bcrypt.compare(req.body.code, user.resetCode);

        if (match) {

            res.status(200).json({ message: "Success Reset Code , now will redirect to change Your Password", data: { id: user._id } });

        } else {

            res.status(400).json({ message: "The verification code you entered isn't valid. Please check the code and try again." });

        };

    } else {

        res.status(400).json({ message: "User Not Found" });

    };

});








// Change Password After Confirm Reset Code

export const changePasswordAfterConfirmResetCode = ErrorHandler(async (req, res, next) => {

    const id = req.headers.id;
    const user = await userModel.findOne({ _id: id });


    if (user) {

        bcrypt.hash(req.body.newPassword, 5, async function (err, hash) {

            user.password = hash;
            user.passwordChangedAt = parseInt(Date.now() / 1000);
            user.resetCode = undefined;

            await user.save();

            res.status(200).json({ message: "Success Change Password", data: user });

        });

    } else {

        res.status(400).json({ message: "User Not Found" });

    };

});