import orderModel from "./order.model.js";
import cartModel from '../cart/cart.model.js';
import productModel from '../product/product.model.js';
import AppError from '../../Utils/appErrors.js';
import Stripe from "stripe";



const stripe = new Stripe("sk_test_51MnigUDNkxC8PssPgunMq4rao0OctIo8Aq2S8SoWxAkQOvpkBVjrHBgkGxkbXTmiLuYDoqabghABjj0kQs9XeoqY00KuKurOCG");



// Function To Handle Errors

const ErrorHandler = (fun) => {

    return (req, res, next) => {

        fun(req, res, next).catch((err) => {

            return next(new AppError(err.message, 404));

        });

    };

};



// Create Session Checkout

export const createNewOrderPaymentVisa = ErrorHandler(async (req, res, next) => {


    const myCart = await cartModel.findOne({ user: req.user._id });


    if (myCart) {


        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                    quantity: 1,

                    price_data: {

                        currency: "usd",

                        product_data: {

                            name: req.user.name,


                        },

                        unit_amount: myCart.totalPriceAfterDiscount * 100,

                    },

                    client_reference_id: myCart._id,
                },
            ],
            mode: 'payment',
            success_url: `${req.protocol}://${req.headers.host}/api/v1/success`,
            cancel_url: `${req.protocol}://${req.headers.host}/api/v1/cart`,
        });


        res.status(200).json({ message: "Success", data: session.url });


    } else {

        res.status(400).json({ message: "Cart Not Found" });

    };



});





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