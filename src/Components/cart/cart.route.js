import { Router } from 'express';
import { allCarts, addProductToMyCart, getCartOfUser, updateQuantity, deleteProductFromMyCart } from './cart.service.js';
import { Authentication, Authorization } from '../user/user.auth.js';





const router = Router();


router.get("/allCarts", allCarts);

router.route("/")
    .get(Authentication, Authorization(["user"]), getCartOfUser)
    .post(Authentication, Authorization(["user"]), addProductToMyCart)
    .delete(Authentication, Authorization(["user"]), deleteProductFromMyCart);


router.route("/:id")
    .patch(Authentication, Authorization(["user"]), updateQuantity);





export default router;