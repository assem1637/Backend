import { Router } from 'express';
import { allCarts, addProductToMyCart, getCartOfUser, updateQuantity, deleteProductFromMyCart, applyCoupon, removeApplyCoupon } from './cart.service.js';
import { Authentication, Authorization } from '../user/user.auth.js';




const router = Router();


router.get("/allCarts", allCarts);

router.route("/")
    .get(Authentication, Authorization(["user"]), getCartOfUser)
    .post(Authentication, Authorization(["user"]), addProductToMyCart)
    .delete(Authentication, Authorization(["user"]), deleteProductFromMyCart)
    .patch(Authentication, Authorization(["user"]), updateQuantity);



router.post("/applyCoupon", Authentication, Authorization(["user"]), applyCoupon);
router.patch("/removeApplyCoupon", Authentication, Authorization(["user"]), removeApplyCoupon);


export default router;