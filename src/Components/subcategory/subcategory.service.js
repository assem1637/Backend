import subCategoryModel from "./subcategory.model.js";
import AppError from "../../Utils/appErrors.js";
import slugify from "slugify";







// Function To Handle Errors

const ErrorHandler = (fun) => {

    return (req, res, next) => {

        fun(req, res, next).catch((err) => {

            return next(new AppError(err.message, 404));

        });

    };

};








// Get All subCategories

export const getAllSubCategories = ErrorHandler(async (req, res, next) => {


    if (req.params.categoryId) {

        const allSubCategories = await subCategoryModel.find({ category: req.params.categoryId }).populate("category", "name");
        res.status(200).json({ message: "Success", data: allSubCategories });

    } else {

        const allSubCategories = await subCategoryModel.find({}).populate("category", "name");
        res.status(200).json({ message: "Success", data: allSubCategories });

    };

});





// Create New subCategory

export const createNewSubCategory = ErrorHandler(async (req, res, next) => {

    const subCategory = await subCategoryModel.findOne({ name: req.body.name.toLowerCase() });

    if (subCategory) {

        res.status(400).json({ message: "subCategory Is Already Here , Please Use Different Name" })

    } else {

        req.body.slug = slugify(req.body.name);

        const newSubCategory = new subCategoryModel(req.body);
        await newSubCategory.save();

        res.status(200).json({ message: "Success", data: newSubCategory });

    };

});







// Get Specific subCategory

export const getSpecificSubCategory = ErrorHandler(async (req, res, next) => {

    const subCategory = await subCategoryModel.findOne({ _id: req.params.id });

    if (subCategory) {

        res.status(200).json({ message: "Success", data: subCategory });

    } else {

        res.status(400).json({ message: "subCategory Not Found" });

    };

});







// Update Specific subCategory

export const updateSpecificSubCategory = ErrorHandler(async (req, res, next) => {

    if (req.body.name) {

        req.body.slug = slugify(req.body.name);

    };


    const subCategory = await subCategoryModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });

    if (subCategory) {

        res.status(200).json({ message: "Success Updated", data: subCategory });

    } else {

        res.status(400).json({ message: "subCategory Not Found" });

    };

});





// Delete Specific subCategory

export const deleteSpecificSubCategory = ErrorHandler(async (req, res, next) => {

    const subCategory = await subCategoryModel.findOneAndDelete({ _id: req.params.id });

    if (subCategory) {

        res.status(200).json({ message: "Success Deleted", data: subCategory });

    } else {

        res.status(400).json({ message: "subCategory Not Found" });

    };

});