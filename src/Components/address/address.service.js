import userModel from "../user/user.model.js";
import AppError from "../../Utils/appErrors.js";










// Function To Handle Errors

const ErrorHandler = (fun) => {

    return (req, res, next) => {

        fun(req, res, next).catch((err) => {

            return next(new AppError(err.message, 404));

        });

    };

};








// Get All Address For Specific User

export const getAllAddress = ErrorHandler(async (req, res, next) => {

    const user = await userModel.findOne({ _id: req.user._id });


    if (user.addressDelivery) {

        res.status(200).json({ message: "Success", data: user.addressDelivery });

    } else {

        res.status(400).json({ message: "Not Found Any Address" });

    };

});







// Create New Address

export const createNewAddress = ErrorHandler(async (req, res, next) => {

    const user = await userModel.findOneAndUpdate({ _id: req.user._id }, { $push: { addressDelivery: req.body } }, { new: true });

    res.status(200).json({ message: "Success", data: user.addressDelivery });

});






// Get Specific Address For Specific User

export const getSpecificAddress = ErrorHandler(async (req, res, next) => {

    const user = await userModel.findOne({ _id: req.user._id });
    const SpecificAddress = user.addressDelivery.find((ele) => ele._id == req.params.id);

    if (SpecificAddress) {

        res.status(200).json({ message: "Success", data: SpecificAddress });

    } else {

        res.status(400).json({ message: "Address Not Found" });

    };

});







// Update Specific Address 

export const updateSpcificAddress = ErrorHandler(async (req, res, next) => {

    const user = await userModel.findOne({ _id: req.user._id });
    const SpecificAddress = user.addressDelivery.find((ele) => ele._id == req.params.id);

    if (SpecificAddress) {


        const data = Object.entries(req.body);

        for (let x = 0; x < data.length; x++) {

            let key = data[x][0];
            let value = data[x][1];

            SpecificAddress[key] = value;

        };


        await user.save();

        res.status(200).json({ message: "Success Updated", data: user.addressDelivery });

    } else {

        res.status(400).json({ message: "Address Not Found" });

    };

});






// Delete Specific Address

export const deleteSpecificAddress = ErrorHandler(async (req, res, next) => {

    const user = await userModel.findOne({ _id: req.user._id });
    const SpecificAddress = user.addressDelivery.find((ele) => ele._id == req.params.id);

    console.log(SpecificAddress);

    if (SpecificAddress) {

        const newDate = await userModel.findOneAndUpdate({ _id: user._id }, { $pull: { addressDelivery: SpecificAddress } }, { new: true });
        res.status(200).json({ message: "Success Deleted", data: newDate.addressDelivery });

    } else {

        res.status(400).json({ message: "Address Not Found" });

    };

});