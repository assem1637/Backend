import orderModel from './order.model1.js';
import userModel from '../user/user.model.js';
import productModel from '../product/product.model.js';
import cartModel from '../cart/cart.model.js';
import AppError from '../../Utils/appErrors.js';








// Function To Handle Errors

const ErrorHandler = (fun) => {

    return (req, res, next) => {

        fun(req, res, next).catch((err) => {

            return next(new AppError(err.message, 404));

        });

    };

};








// Get All Orders

export const getAllOrders = ErrorHandler(async (req, res, next) => {

    const allOrders = await orderModel.find({});

    if (allOrders) {

        res.status(200).json({ message: "Success", data: allOrders });

    } else {

        res.status(400).json({ message: "Not Found Any Order" });

    };

});






// Get Orders For Specific User

export const ordersOfUser = ErrorHandler(async (req, res, next) => {

    const ordersForUser = await orderModel.find({ user: req.user.id });

    if (ordersForUser) {

        res.status(200).json({ message: "Success", data: ordersForUser });

    } else {

        res.status(400).json({ message: "Not Found Any Order" });

    };

});








// Create New Order And Pay With Payment Cash


export const createNewOrderPaymentCash = ErrorHandler(async (req, res, next) => {

    const myCart = await cartModel.findOne({ user: req.user.id });

    if (myCart) {

        req.body.cartItems = myCart.cartItems;
        req.body.user = req.user.id;
        req.body.totalPrice = myCart.totalPriceAfterDiscount;
        req.body.discount = myCart.discount;
        req.body.taxPrice = 0;
        req.body.shippingPrice = 0;
        req.body.totalPriceAfterExtraPrice = Number(myCart.totalPrice) - (Number(req.body.taxPrice) + Number(req.body.shippingPrice));
        req.body.paymentMethods = "cash";
        req.body.addressDelivery = req.user.addressDelivery[req.user.addressDelivery.length - 1];


        const newOrder = new orderModel(req.body);
        await newOrder.save();


        myCart.cartItems.forEach(async (ele) => {

            const product = await productModel.findOne({ _id: ele.product });
            product.soldCount += 1;
            product.quantity -= ele.quantity;

            await product.save();

        });



        await cartModel.findOneAndDelete({ _id: myCart.id });


        res.status(200).json({ message: "Success", data: newOrder });

    } else {

        res.status(400).json({ message: "Your Cart Is Empty" });

    };

});