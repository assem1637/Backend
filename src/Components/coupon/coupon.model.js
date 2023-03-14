import mongoose from 'mongoose';






const couponSchema = mongoose.Schema({


    code: {

        type: String,
        required: [true, "Code Of Coupon Is Required"],
        trim: true,
        uppercase: true,
        unique: [true, "Code Of Coupon Is Unique"],
        minlength: [2, "2 Is Too Short Code Of Coupon"],

    },



    discount: {

        type: Number,
        required: [true, "Discount Of Coupon Is Required"],

    },


    expire: {

        type: Date,
        required: [true, "Expire Of Coupon Is Required"],

    },


}, { timestamps: true });




const couponModel = mongoose.model("coupon", couponSchema);




export default couponModel;