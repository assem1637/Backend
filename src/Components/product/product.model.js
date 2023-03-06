import mongoose from "mongoose";








const productSchema = mongoose.Schema({

    name: {

        type: String,
        required: [true, "Name Of Product Is Required"],
        trim: true,
        minlength: [2, "2 Is Too Short Name Of Product"],
        lowercase: true,

    },


    slug: {

        type: String,
        lowercase: true,

    },


    price: {

        type: Number,
        required: [true, "Price Of Product Is Required"],

    },


    priceAfterDiscount: {

        type: Number,
        required: [true, "PriceAfterDiscount Of Product Is Required"],

    },


    description: {

        type: String,
        required: [true, "Description Of Product Is Required"],

    },


    quantity: {

        type: Number,
        required: [true, "Quantity Of Product Is Required"],

    },


    imageCover: {

        type: String,
        required: [true, "ImageCover Of Product Is Required"],

    },


    images: [String],


    colors: [String],


    soldCount: {

        type: Number,
        default: 0,

    },


    category: {

        type: mongoose.SchemaTypes.ObjectId,
        ref: "category",
        required: [true, "Category Of Product Is Required"],

    },


    subcategory: {

        type: mongoose.SchemaTypes.ObjectId,
        ref: "subcategory",
        required: [true, "subCategory Of Product Is Required"],

    },


    brand: {

        type: mongoose.SchemaTypes.ObjectId,
        ref: "brand",
        required: [true, "Brand Of Product Is Required"],

    },


    ratingAverage: {

        type: Number,
        min: [1, "1 Is The Lowest Rate"],
        max: [5, "5 Is The Largest Rate"],
        required: [true, "ratingAverage Of Product Is Required"],

    },


    ratingCount: {

        type: Number,
        default: 0,

    },


}, { timestamps: true });




const productModel = mongoose.model("product", productSchema);




export default productModel;