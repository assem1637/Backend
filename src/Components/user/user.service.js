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







// Get All Users

export const getAllUsers = ErrorHandler(async (req, res, next) => {

    const allUsers = await userModel.find({});
    res.status(200).json({ message: "Success", data: allUsers });

});






// Create New User By Admin

export const createNewUser = ErrorHandler(async (req, res, next) => {

    const user = await userModel.findOne({ email: req.body.email });


    if (user) {

        res.status(400).json({ message: `This Is Email: ${req.body.email} Already Exists` });

    } else {

        bcrypt.hash(req.body.password, 5, async function (err, hash) {


            console.log(req.file);

            if (req.file) {

                const cloud = await cloudinary.uploader.upload(req.file.path);
                req.body.profileImg = cloud.secure_url;

                console.log(cloud.secure_url);

            };


            req.body.password = hash;

            const newUser = new userModel(req.body);
            await newUser.save();


            const token = jwt.sign({ email: req.body.email }, process.env.SECRET_KEY_SIGNUP);
            confirmEmail(req.body.email, token, req.protocol, req.headers.host);

            res.status(200).json({ message: "Success Create New Account", data: newUser });


        });

    };

});








// Get Specific User

export const getSpecificUser = ErrorHandler(async (req, res, next) => {

    const user = await userModel.findOne({ _id: req.params.id });

    if (user) {

        res.status(200).json({ message: "Success", data: user });

    } else {

        res.status(400).json({ message: "User Not Found" });

    };

});







// Update Specific User

export const updateSpecificUser = ErrorHandler(async (req, res, next) => {

    const user = await userModel.findOne({ _id: req.params.id });

    if (user) {


        if (req.body.password) {

            bcrypt.hash(req.body.password, 5, async function (err, hash) {

                req.body.password = hash;
                req.body.passwordChangedAt = parseInt(Date.now() / 1000);

                if (req.file) {

                    const cloud = await cloudinary.uploader.upload(req.file.path);
                    req.body.profileImg = cloud.secure_url;

                };


                if (req.body.email) {

                    if (!(req.body.email == user.email)) {

                        const token = jwt.sign({ email: req.body.email }, process.env.SECRET_KEY_SIGNUP);
                        confirmEmail(req.body.email, token, req.protocol, req.headers.host);

                    };

                };


                const afterUpdateUser = await userModel.findByIdAndUpdate({ _id: user._id }, req.body, { new: true });

                res.status(200).json({ message: "Success Updated", data: afterUpdateUser });


            });

        } else {



            if (req.file) {

                const cloud = await cloudinary.uploader.upload(req.file.path);
                req.body.profileImg = cloud.secure_url;

            };


            if (req.body.email) {

                if (!(req.body.email == user.email)) {

                    const token = jwt.sign({ email: req.body.email }, process.env.SECRET_KEY_SIGNUP);
                    confirmEmail(req.body.email, token, req.protocol, req.headers.host);

                };

            };


            const afterUpdateUser = await userModel.findByIdAndUpdate({ _id: user._id }, req.body, { new: true });

            res.status(200).json({ message: "Success Updated", data: afterUpdateUser });


        };



    } else {

        res.status(400).json({ message: "User Not Found" });

    };

});







// Delete Specific User

export const deleteSpecificUser = ErrorHandler(async (req, res, next) => {

    const user = await userModel.findOneAndDelete({ _id: req.params.id });

    if (user) {

        res.status(200).json({ message: "Success Deleted", data: user });

    } else {

        res.status(400).json({ message: "User Not Found" });

    };

});






// Change Password 

export const changePassword = ErrorHandler(async (req, res, next) => {

    const user = await userModel.findOne({ _id: req.params.id });


    if (user) {


        bcrypt.hash(req.body.password, 5, async function (err, hash) {

            user.password = hash;
            user.passwordChangedAt = parseInt(Date.now() / 1000);
            await user.save();

            res.status(200).json({ message: "Success Change Password", data: user });


        });


    } else {

        res.status(400).json({ message: "User Not Found" });

    };

});