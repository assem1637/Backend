import { Router } from 'express';
import { getAllOrders, getOrderOfUser, createNewOrderPaymentCash, updatePay, updateDelivered } from './order.service.js';
import { Authentication, Authorization } from '../user/user.auth.js';




const router = Router();



router.route("/")
    .get(getAllOrders)
    .post(Authentication, Authorization(["user"]), createNewOrderPaymentCash);




router.get("/getOrderOfUser", Authentication, Authorization(["user"]), getOrderOfUser);
// router.post("/createNewOrderPaymentVisa", Authentication, Authorization(["user"]), createNewOrderPaymentVisa);



router.put("/updatePay/:id", Authentication, Authorization(["admin"]), updatePay);
router.put("/updateDelivered/:id", Authentication, Authorization(["admin"]), updateDelivered);




export default router;