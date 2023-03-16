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



// Function To Calc Total Price

const calcTotalPrice = (cart) => {

    let totalPrice = 0;

    cart.cartItems.map((ele) => {

        totalPrice += Number(ele.quantity) * Number(ele.price);

    });


    return totalPrice;

};




// all carts

export const allCarts = ErrorHandler(async (req, res, next) => {

    const allCarts = await cartModel.find({}).populate("user cartItems.product", "name price imageCover");
    res.status(200).json({ message: "Success", data: allCarts });

});




// Get User Cart

export const getCartOfUser = ErrorHandler(async (req, res, next) => {

    const myCart = await cartModel.findOne({ user: req.user._id });

    if (myCart) {

        res.status(200).json({ message: "Success", data: myCart });

    } else {

        res.status(400).json({ message: "Cart Not Found" });

    };

});









// Add Product To My Cart 

export const addProductToMyCart = ErrorHandler(async (req, res, next) => {

    const myCart = await cartModel.findOne({ user: req.user._id });

    if (myCart) {

        const product = await productModel.findOne({ _id: req.body.product });


        if (product) {

            const productInMyCart = myCart.cartItems.find((ele) => ele.product == product.id);

            console.log(productInMyCart);

            if (productInMyCart) {


                productInMyCart.quantity += Number(req.body.quantity);


            } else {


                myCart.cartItems.push({

                    product: req.body.product,
                    quantity: req.body.quantity,
                    price: product.price,

                });


            };


            let totalPrice = calcTotalPrice(myCart);
            let discount = 0;
            let totalPriceAfterDiscount = Number(totalPrice) - Number(discount);

            myCart.totalPrice = totalPrice;
            myCart.discount = discount;
            myCart.totalPriceAfterDiscount = totalPriceAfterDiscount;

            await myCart.save();

            res.status(200).json({ message: "Success Add To Your Cart", data: myCart });


        } else {

            res.status(400).json({ message: "Product Not Found" });

        };

    } else {

        const product = await productModel.findOne({ _id: req.body.product });

        if (product) {


            let totalPrice = Number(product.price) * Number(req.body.quantity);
            let discount = 0;
            let totalPriceAfterDiscount = Number(totalPrice) - Number(discount);

            const newMyCart = new cartModel({

                cartItems: [{

                    product: req.body.product,
                    quantity: req.body.quantity,
                    price: product.price,

                }],

                user: req.user._id,

                totalPrice,

                discount,

                totalPriceAfterDiscount,

            });

            await newMyCart.save();

            res.status(200).json({ message: "Success Create Your Cart And Add Product To Your Cart", data: newMyCart });


        } else {

            res.status(400).json({ message: "Product Not Found" });

        };

    };

});






// Update Qantity Of Specific Product

export const updateQuantity = ErrorHandler(async (req, res, next) => {



});





// Delete Product From My Cart

export const deleteProductFromMyCart = ErrorHandler(async (req, res, next) => {

    const myCart = await cartModel.findOne({ user: req.user._id });

    if (myCart) {

        const product = await productModel.findOne({ _id: req.body.product });

        if (product) {

            if (myCart.cartItems.length > 1) {


                let productInMyCart = await myCart.cartItems.find((ele) => ele.product == product.id);

                if (productInMyCart) {


                    console.log(productInMyCart);

                    let index = (myCart.cartItems).indexOf(productInMyCart);
                    console.log(index);

                    myCart.cartItems.splice(index, 1);

                    let totalPrice = calcTotalPrice(myCart);
                    let discount = 0;
                    let totalPriceAfterDiscount = Number(totalPrice) - Number(discount);

                    myCart.totalPrice = totalPrice;
                    myCart.discount = discount;
                    myCart.totalPriceAfterDiscount = totalPriceAfterDiscount;

                    await myCart.save();


                    res.status(200).json({ message: "Success Deleted", data: myCart });



                } else {

                    res.status(400).json({ message: "Product Not Found" });

                };



            } else {

                let productInMyCart = await myCart.cartItems.find((ele) => ele.product == product.id);

                if (productInMyCart) {

                    await cartModel.findByIdAndDelete({ _id: myCart._id });
                    res.status(200).json({ message: "Now Your Cart Is Empty" });

                } else {

                    res.status(400).json({ message: "Product Not Found" });

                };

            };

        } else {

            res.status(400).json({ message: "Product Not Found" });

        };

    } else {

        res.status(400).json({ message: "Cart Not Found" });

    };

});