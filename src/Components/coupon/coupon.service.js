import couponModel from "./coupon.model.js";
import AppError from "../../Utils/appErrors.js";








// Function To Handle Errors

const ErrorHandler = (fun) => {

    return (req, res, next) => {

        fun(req, res, next).catch((err) => {

            return next(new AppError(err.message, 404));

        });

    };

};







// Get All Coupons

export const getAllCoupons = ErrorHandler(async (req, res, next) => {

    const allCoupons = await couponModel.find({});
    res.status(200).json({ message: "Success", data: allCoupons });

});





// Create New Coupon

export const createNewCoupon = ErrorHandler(async (req, res, next) => {

    const coupon = await couponModel.findOne({ code: req.body.code.toUpperCase() });

    if (coupon) {

        res.status(400).json({ message: `This Coupon ${req.body.code.toUpperCase()} Is Already Exists` });

    } else {

        const time = Date.now() + ((Number(req.body.expire * 1) > 0 ? Number(req.body.expire * 1) : 1) * 24 * 60 * 60 * 1000);
        req.body.expire = time;

        const newCoupon = new couponModel(req.body);
        await newCoupon.save();

        res.status(200).json({ message: "Success", data: newCoupon });

    };

});







// Get Specific Coupon

export const getSpecificCoupon = ErrorHandler(async (req, res, next) => {

    const coupon = await couponModel.findOne({ _id: req.params.id });

    if (coupon) {

        res.status(200).json({ message: "Success", data: coupon });

    } else {

        res.status(400).json({ message: "Coupon Not Found" });

    };

});





// Update Specific Coupon

export const updateSpecificCoupon = ErrorHandler(async (req, res, next) => {


    if (req.body.expire) {

        const time = Date.now() + ((Number(req.body.expire * 1) > 0 ? Number(req.body.expire * 1) : 1) * 24 * 60 * 60 * 1000);
        req.body.expire = time;

    };



    const coupon = await couponModel.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true });

    if (coupon) {

        res.status(200).json({ message: "Success Updated", data: coupon });

    } else {

        res.status(400).json({ message: "Coupon Not Found" });

    };

});




// Delete Specific Coupon 

export const deleteSpecificCoupon = ErrorHandler(async (req, res, next) => {

    const coupon = await couponModel.findOneAndDelete({ _id: req.params.id });

    if (coupon) {

        res.status(200).json({ message: "Success Deleted", data: coupon });

    } else {

        res.status(400).json({ message: "Coupon Not Found" });

    };

});