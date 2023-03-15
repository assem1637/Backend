import mongoose from 'mongoose';






const cartSchema = mongoose.Schema({


    cartItems: [

        {

            product: {

                type: mongoose.SchemaTypes.ObjectId,
                ref: "product",

            },

            quantity: Number,

            price: Number,

        },

    ],


    totalPrice: Number,


    discount: Number,


    totalPriceAfterDiscount: Number,


}, { timestamps: true });




const cartModel = mongoose.model("cart", cartSchema);




export default cartModel;