import orderModel from "./order.model.js";
import cartModel from '../cart/cart.model.js';
import productModel from '../product/product.model.js';
import userModel from "../user/user.model.js";
import AppError from '../../Utils/appErrors.js';








// Function To Handle Errors

const ErrorHandler = (fun) => {

    return (req, res, next) => {

        fun(req, res, next).catch((err) => {

            return next(new AppError(err.message, 404));

        });

    };

};