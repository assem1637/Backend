import mongoose from "mongoose";







const orderSchema = mongoose.Schema({


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

    },



    totalPrice: Number,

    discount: {

        type: Number,
        default: 0,

    },


    taxPrice: {

        type: Number,
        default: 0,

    },


    shippingPrice: {

        type: Number,
        default: 0,

    },



    totalPriceAfterExtraPrice: {

        type: Number,

    },



    paymentMethods: {

        type: String,
        eunm: ["cash", "visa"],
        default: "cash",

    },



    isPayed: {

        type: Boolean,
        default: false,

    },



    payedAt: {

        type: Date,

    },



    isDelivered: {

        type: Boolean,
        default: false,

    },



    deliveredAt: {

        type: Date,

    },




    addressDelivery: {

        name: String,
        address: String,
        phone: String,
        location: {

            type: String,
            enum: ["home", "work"],
            default: "home",

        },

    },



}, { timestamps: true });




const orderModel = mongoose.model("order", orderSchema);



export default orderModel;