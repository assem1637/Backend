import productModel from '../product/product.model.js';
import userModel from '../user/user.model.js';
import AppError from '../../Utils/appErrors.js';








// Function To Handle Errors

const ErrorHandler = (fun) => {

    return (req, res, next) => {

        fun(req, res, next).catch((err) => {

            return next(new AppError(err.message, 404));

        });

    };

};







// Get All Product Wishlist For Specific User

export const getAllWishlistOfSpecificUser = ErrorHandler(async (req, res, next) => {

    const user = await userModel.findOne({ _id: req.user._id }).populate("wishlist", "name price imageCover");

    if (user.wishlist) {

        res.status(200).json({ message: "Success", data: user.wishlist });

    } else {

        res.status(400).json({ message: "Your Wishlist Is Empty" });

    };

});






// Add Specific Product To WishList 

export const addProductToWishlist = ErrorHandler(async (req, res, next) => {

    const product = await productModel.findOne({ _id: req.params.id });
    const user = await userModel.findOne({ _id: req.user._id });

    if (product) {


        await userModel.findOneAndUpdate({ _id: user._id }, { $addToSet: { wishlist: product._id } });
        res.status(200).json({ message: "Success Add To WishList" });


    } else {

        res.status(400).json({ message: "Product Not Found" });

    };

});







// Delete Specific Product From WishList 

export const deleteProductFromWishlist = ErrorHandler(async (req, res, next) => {

    const product = await productModel.findOne({ _id: req.params.id });
    const user = await userModel.findOne({ _id: req.user._id });

    if (product) {


        await userModel.findOneAndUpdate({ _id: user._id }, { $pull: { wishlist: product._id } });
        res.status(200).json({ message: "Success Remove From WishList" });


    } else {

        res.status(400).json({ message: "Product Not Found" });

    };

});