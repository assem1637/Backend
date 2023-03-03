import mongoose from "mongoose";







const categorySchema = mongoose.Schema({

    name: {

        type: String,
        required: [true, "Name Of Category Is Required"],
        trim: true,
        unique: [true, "Name Of Category Is Unique"],
        minlength: [2, "2 Is Too Short Name Of Category"],
        lowercase: true,

    },


    slug: {

        type: String,
        lowercase: true,

    },


    image: {

        type: String,
        required: [true, "Image Of Category Is Required"],

    },


}, { timestamps: true });




const categoryModel = mongoose.model("category", categorySchema);




export default categoryModel;