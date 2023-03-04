import mongoose from "mongoose";







const subCategorySchema = mongoose.Schema({

    name: {

        type: String,
        required: [true, "Name Of subCategory Is Required"],
        trim: true,
        unique: [true, "Name Of subCategory Is Unique"],
        minlength: [2, "2 Is Too Short Name Of subCategory"],
        lowercase: true,

    },


    slug: {

        type: String,
        lowercase: true,

    },


    category: {

        type: mongoose.SchemaTypes.ObjectId,
        ref: "category",
        required: [true, "category Of subCategory Is Required"],

    },


}, { timestamps: true });





const subCategoryModel = mongoose.model("subcategory", subCategorySchema);




export default subCategoryModel;