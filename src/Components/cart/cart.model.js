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



    user: {

        type: mongoose.SchemaTypes.ObjectId,
        ref: "user",
        required: [true, "User Of Cart Is Required"],

    },


    totalPrice: Number,


    discount: {

        type: Number,
        default: 0,

    },


    totalPriceAfterDiscount: Number,


}, { timestamps: true });




const cartModel = mongoose.model("cart", cartSchema);




export default cartModel;