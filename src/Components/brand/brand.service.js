import brandModel from "./brand.model.js";
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









// Get All Brands

export const getAllBrands = ErrorHandler(async (req, res, next) => {

    const allBrands = await brandModel.find({});
    res.status(200).json({ message: "Success", data: allBrands });

});






// Create New Brand

export const createNewBrand = ErrorHandler(async (req, res, next) => {

    const brand = await brandModel.findOne({ name: req.body.name.toLowerCase() });

    if (brand) {

        res.status(400).json({ message: "Brand Is Already Here , Please Use Different Name" });

    } else {


        req.body.slug = slugify(req.body.name);


        if (req.file) {

            const cloud = await cloudinary.uploader.upload(req.file.path);
            req.body.image = cloud.secure_url;

        };


        const newBrand = new brandModel(req.body);
        await newBrand.save();


        res.status(200).json({ message: "Success", data: newBrand });


    };

});







// Get Specific Brand

export const getSpecificBrand = ErrorHandler(async (req, res, next) => {


    const brand = await brandModel.findOne({ _id: req.params.id });

    if (brand) {

        res.status(200).json({ message: "Success", data: brand });

    } else {

        res.status(400).json({ message: "Brand Not Found" });

    };

});






// Update Sepcific Brand

export const updateSpecificBrand = ErrorHandler(async (req, res, next) => {

    if (req.body.name) {

        req.body.slug = slugify(req.body.name);

    };


    if (req.file) {

        const cloud = await cloudinary.uploader.upload(req.file.path);
        req.body.image = cloud.secure_url;

    };


    const brand = await brandModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });

    if (brand) {

        res.status(200).json({ message: "Success Updated", data: brand });

    } else {

        res.status(400).json({ message: "Brand Not Found" });

    };

});








// Delete Specific Brand

export const deleteSpecificBrand = ErrorHandler(async (req, res, next) => {

    const brand = await brandModel.findOneAndDelete({ _id: req.params.id });

    if (brand) {

        res.status(200).json({ message: "Success Deleted", data: brand });

    } else {

        res.status(400).json({ message: "Brand Not Found" });

    };

});