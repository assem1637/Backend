import cartModel from "./cart.model.js";
import productModel from '../product/product.model.js';
import AppError from "../../Utils/appErrors.js";









// Function To Handle Errors

const ErrorHandler = (fun) => {

    return (req, res, next) => {

        fun(req, res, next).catch((err) => {

            return next(new AppError(err.message, 404));

        });

    };

};