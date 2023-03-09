import userModel from './user.model.js';
import AppError from '../../Utils/appErrors.js';
import cloudinary from 'cloudinary';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import confirmEmail from '../../Utils/confirmEmail.js';








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

            const token = jwt.sign({

                id: user._id,
                name: user.name,
                email: user.email,
                age: user.age,
                emailConfirm: user.emailConfirm,
                isActive: user.isActive,
                phone: user.phone,
                profileImg: user.profileImg,

            }, process.env.SECRET_KEY_SIGNIN);

            res.status(200).json({ message: "Success", token });


        } else {

            res.status(400).json({ message: "Password Incorrect" });

        };

    } else {

        res.status(400).json({ message: `This Email: ${req.body.email} Doesn't Exists` });

    };

});