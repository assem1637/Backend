import productModel from './product.model.js';
import AppError from '../../Utils/appErrors.js';
import cloudinary from 'cloudinary';
import slugify from 'slugify';








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








// Get All Products

export const getAllProducts = ErrorHandler(async (req, res, next) => {

    const allProducts = await productModel.find({}).populate("category subcategory brand", "name");
    res.status(200).json({ message: "Success", data: allProducts });

});






// Create New Product

export const createNewProduct = ErrorHandler(async (req, res, next) => {

    req.body.slug = slugify(req.body.name);

    if (req.files.imageCover) {

        const cloud = await cloudinary.uploader.upload(req.files.imageCover[0].path);
        req.body.imageCover = cloud.secure_url;

    };


    if (req.files.images) {

        const pathOfImgs = [];
        const finalImgs = [];


        (req.files.images).forEach((ele) => {

            pathOfImgs.push(ele.path);

        });


        for (let x = 0; x < pathOfImgs.length; x++) {

            const cloud = await cloudinary.uploader.upload(pathOfImgs[x]);
            finalImgs.push(cloud.secure_url);

        };


        req.body.images = finalImgs;

    };



    const newProduct = new productModel(req.body);
    await newProduct.save();


    res.status(200).json({ message: "Success", data: newProduct });

});






// Get Specific Product

export const getSpecificProduct = ErrorHandler(async (req, res, next) => {

    const product = await productModel.findOne({ _id: req.params.id });

    if (product) {

        res.status(200).json({ message: "Success", data: product });

    } else {

        res.status(400).json({ message: "Product Not Found" });

    };

});







// Update Specific Product

export const updateSpecificProduct = ErrorHandler(async (req, res, next) => {


    if (req.body.name) {

        req.body.slug = slugify(req.body.name);

    };


    if (req.files.imageCover) {

        const cloud = await cloudinary.uploader.upload(req.files.imageCover[0].path);
        req.body.imageCover = cloud.secure_url;

    };


    if (req.files.images) {

        const pathOfImgs = [];
        const finalImgs = [];


        (req.files.images).forEach((ele) => {

            pathOfImgs.push(ele.path);

        });


        for (let x = 0; x < pathOfImgs.length; x++) {

            const cloud = await cloudinary.uploader.upload(pathOfImgs[x]);
            finalImgs.push(cloud.secure_url);

        };


        req.body.images = finalImgs;

    };



    const product = await productModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });


    if (product) {

        res.status(200).json({ message: "Success Updated", data: product });

    } else {

        res.status(400).json({ message: "Product Not Found" });

    };

});






// Delete Specific Product

export const deleteSpecificProduct = ErrorHandler(async (req, res, next) => {

    const product = await productModel.findOneAndDelete({ _id: req.params.id });

    if (product) {

        res.status(200).json({ message: "Success Deleted", data: product });

    } else {

        res.status(400).json({ message: "Product Not Found" });

    };

});