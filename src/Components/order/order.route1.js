import { Router } from 'express';
import { getAllOrders, createNewOrderPaymentCash, ordersOfUser, updateThePay, updateTheDelivery } from './order.service1.js';
import { Authentication, Authorization } from '../user/user.auth.js';




const router = Router();


router.route("/")
    .get(getAllOrders)
    .post(Authentication, Authorization(["user"]), createNewOrderPaymentCash);



router.get("/ordersOfUser", Authentication, Authorization(["user"]), ordersOfUser);
router.put("/updateThePay/:id", Authentication, Authorization(["admin"]), updateThePay);
router.put("/updateTheDelivery/:id", Authentication, Authorization(["admin"]), updateTheDelivery);
// router.post("/checkoutSession", Authentication, Authorization(["user"]), checkoutSession);




export default router;