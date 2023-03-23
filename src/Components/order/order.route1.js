import { Router } from 'express';
import { getAllOrders, createNewOrderPaymentCash, ordersOfUser } from './order.service1.js';
import { Authentication, Authorization } from '../user/user.auth.js';




const router = Router();


router.route("/")
    .get(getAllOrders)
    .post(Authentication, Authorization(["user"]), createNewOrderPaymentCash);



router.get("/ordersOfUser", Authentication, Authorization(["user"]), ordersOfUser);
// router.post("/checkoutSession", Authentication, Authorization(["user"]), checkoutSession);
// router.put("/updateThePay", Authentication, Authorization(["admin"]), updateThePay);
// router.put("/updateTheDelivery", Authentication, Authorization(["admin"]), updateTheDelivery);




export default router;