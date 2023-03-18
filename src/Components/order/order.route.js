import { Router } from 'express';
import { getAllOrders, createNewOrderPaymentCash, updateDeliveryAddress, createNewOrderPaymentVisa, getOrderOfUser } from './order.service.js';
import { Authentication, Authorization } from '../user/user.auth.js';




const router = Router();



router.route("/")
    .get(getAllOrders)
    .post(Authentication, Authorization(["user"]), createNewOrderPaymentCash)
    .put(Authentication, Authorization(["user"]), updateDeliveryAddress);



router.post("/createNewOrderPaymentVisa", Authentication, Authorization(["user"]), createNewOrderPaymentVisa);

router.get("/getOrderOfUser", Authentication, Authorization(["user"]), getOrderOfUser);



export default router;