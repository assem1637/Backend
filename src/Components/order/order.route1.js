import { Router } from 'express';
import { getAllOrders, createNewOrderPaymentCash, checkoutSession, ordersOfUser, updateThePay, updateTheDelivery } from './order.service1.js';
import { Authentication, Authorization } from '../user/user.auth.js';




const router = Router();


router.route("/")
    .get(getAllOrders)
    .post(Authentication, Authorization(["user"]), createNewOrderPaymentCash);



router.post("/checkoutSession", Authentication, Authorization(["user"]), checkoutSession);
router.get("/ordersOfUser", Authentication, Authorization(["user"]), ordersOfUser);
router.put("/updateThePay", Authentication, Authorization(["admin"]), updateThePay);
router.put("/updateTheDelivery", Authentication, Authorization(["admin"]), updateTheDelivery);




export default router;