process.on("uncaughtException", (err) => {

    console.log("UncaughtException", err);

});


import dotenv from 'dotenv';
dotenv.config({ path: "./config/.env" });






import express from 'express';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import dbConnection from './src/DB/dbConnection.js';
import AppError from './src/Utils/appErrors.js';
import categoryRouter from './src/Components/category/category.route.js';
import subCategoryRouter from './src/Components/subcategory/subcategory.route.js';
import brandRouter from './src/Components/brand/brand.route.js';
import productRouter from './src/Components/product/product.route.js';
import userRouter from './src/Components/user/user.route.js';
import couponRouter from './src/Components/coupon/coupon.route.js';
import wishlistRouter from './src/Components/wishlist/wishlist.route.js';
import addressRouter from './src/Components/address/address.route.js';
import cartRouter from './src/Components/cart/cart.route.js';
import orderRouter from './src/Components/order/order.route.js';
import { paymentWithVisa } from './src/Components/order/order.service.js';



const app = express();
const port = process.env.PORT || 3000;

dbConnection();


// Enable Other Domains To Access The Routes
app.use(cors());
app.options('*', cors()) // include before other routes


// compress all responses
app.use(compression())


app.use(express.json({ limit: "20kb" }));





app.post('/webhook-checkout', express.raw({ type: 'application/json' }), (req, res, next) => {
    const sig = request.headers['stripe-signature'];

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, "whsec_kRHZDUw9vg6tKpZDbJIScaYFDS5cJ7Sx");
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    };


    if (event.type === 'checkout.session.completed') {

        console.log(event.data.object.client_reference_id);
        paymentWithVisa(event.data.object);

    };


    res.status(200).json({ received: true });

});




if (process.env.MODE_NOW === "development") {

    app.use(morgan("dev"));

};



app.use("/api/v1/category", categoryRouter);
app.use("/api/v1/subcategory", subCategoryRouter);
app.use("/api/v1/brand", brandRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/coupon", couponRouter);
app.use("/api/v1/wishlist", wishlistRouter);
app.use("/api/v1/address", addressRouter);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/order", orderRouter);



app.all("*", (req, res, next) => {

    return next(new AppError(`This Is Route: ${req.originalUrl} Is Not Found In The Server`, 404));

});


app.use((err, req, res, next) => {

    err.statusCode = err.statusCode || 404;

    if (process.env.MODE_NOW == "development") {

        res.status(err.statusCode).json({ message: err.message, statusCode: err.statusCode, err, stack: err.stack });

    } else {

        res.status(err.statusCode).json({ message: err.message, statusCode: err.statusCode, err });

    };

});


app.listen(port, () => {

    console.log('Server Is Running...');

});




// Catch Errors Outside Express

process.on("unhandledRejection", (err) => {

    console.log("UnhandledRejection", err);

});