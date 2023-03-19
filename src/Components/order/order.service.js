import orderModel from "./order.model.js";
import cartModel from '../cart/cart.model.js';
import productModel from '../product/product.model.js';
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

    const allOrders = await orderModel.find({}).populate("user cartItems.product", "name imageCover price profileImg");
    res.status(200).json({ message: "Success", data: allOrders });

});






// Get All Orders For Specific User 

export const getOrderOfUser = ErrorHandler(async (req, res, next) => {

    const orderOfUser = await orderModel.find({ user: req.user._id });

    if (orderOfUser) {

        res.status(200).json({ message: "Success", data: orderOfUser });

    } else {

        res.status(400).json({ message: "Not Found Any Order" });

    };

});




// Create New Order And Pay With Cash

export const createNewOrderPaymentCash = ErrorHandler(async (req, res, next) => {

    const myCart = await cartModel.findOne({ user: req.user._id });

    if (myCart) {

        req.body.cartItems = myCart.cartItems;
        req.body.user = myCart.user;
        req.body.totalPrice = myCart.totalPriceAfterDiscount;
        req.body.taxPrice = 0;
        req.body.shippingPrice = 0;
        req.body.totalPriceAfterExtraPrice = Number(req.body.totalPrice) - (Number(req.body.taxPrice) + Number(req.body.shippingPrice));
        req.body.paymentMethods = "cash";
        req.body.addressDelivery = req.user.addressDelivery[req.user.addressDelivery.length - 1];


        myCart.cartItems.forEach(async (ele) => {

            const product = await productModel.findOne({ _id: ele.product });
            product.soldCount += 1;
            product.quantity -= ele.quantity;

            await product.save();

        });


        myCart.cartItems = [];
        await cartModel.findOneAndDelete({ _id: myCart._id });

        const newOrder = new orderModel(req.body);
        await newOrder.save();

        res.status(200).json({ message: "Success", data: newOrder });

    } else {

        res.status(400).json({ message: "Cart Not Found" });

    };

});








// Update Payed Of Order

export const updatePay = ErrorHandler(async (req, res, next) => {

    const myOrder = await orderModel.findOne({ _id: req.params.id });

    if (myOrder) {

        myOrder.isPayed = true;
        myOrder.payedAt = Date.now();

        await myOrder.save();

        res.status(200).json({ message: "Success Updated The Pay", data: myOrder });

    } else {

        res.status(400).json({ message: "Order Not Found" });

    };

});







// Update Delivered Of Order

export const updateDelivered = ErrorHandler(async (req, res, next) => {

    const myOrder = await orderModel.findOne({ _id: req.params.id });

    if (myOrder) {

        myOrder.isDelivered = true;
        myOrder.deliveredAt = Date.now();

        await myOrder.save();


        res.status(200).json({ message: "Success Updated The Delivery", data: myOrder });

    } else {

        res.status(400).json({ message: "Order Not Found" });

    };

});