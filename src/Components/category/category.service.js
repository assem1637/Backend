import categoryModel from "./category.model.js";
import AppError from "../../Utils/appErrors.js";
import slugify from "slugify";
import cloudinary from 'cloudinary';








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







// Get All Categories

export const getAllCategories = ErrorHandler(async (req, res, next) => {

    const allCategories = await categoryModel.find({});
    res.status(200).json({ message: "Success", data: allCategories });

});







// Create New Category

export const createNewCategory = ErrorHandler(async (req, res, next) => {

    const category = await categoryModel.findOne({ name: req.body.name.toLowerCase() });


    if (category) {

        res.status(400).json({ message: "Category Is Already Here , Please Use Different Name" });

    } else {

        req.body.slug = slugify(req.body.name);


        if (req.file) {

            const cloud = await cloudinary.uploader.upload(req.file.path);
            req.body.image = cloud.secure_url;

        };


        const newCategory = new categoryModel(req.body);
        await newCategory.save();

        res.status(200).json({ message: "Success", data: newCategory });

    };

});








// Get Specific Category

export const getSpecificCategory = ErrorHandler(async (req, res, next) => {

    const category = await categoryModel.findOne({ _id: req.params.id });

    if (category) {

        res.status(200).json({ message: "Success", data: category });

    } else {

        res.status(400).json({ message: "Category Not Found" });

    };

});







// Update Specific Category

export const updateSpecificCategory = ErrorHandler(async (req, res, next) => {

    if (req.body.name) {

        req.body.slug = slugify(req.body.name);

    };


    if (req.file) {

        const cloud = await cloudinary.uploader.upload(req.file.path);
        req.body.image = cloud.secure_url;

    };


    const category = await categoryModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });

    if (category) {

        res.status(200).json({ message: "Success Updated", data: category });

    } else {

        res.status(400).json({ message: "Category Not Found" });

    };


});







// Delete Specific Category

export const deleteSpecificCategory = ErrorHandler(async (req, res, next) => {

    const category = await categoryModel.findOneAndDelete({ _id: req.params.id });

    if (category) {

        res.status(200).json({ message: "Success Deleted", data: category });

    } else {

        res.status(400).json({ message: "Category Not Found" });

    };

});