import { Router } from 'express';
import { getAllCarts, addProductToMyCart, getCartOfUser, updateQuantity, deleteProductFromMyCart } from './cart.service.js';
import { Authentication, Authorization } from '../user/user.auth.js';







const router = Router();



router.route("/")
    .get(Authentication, Authorization(["admin"]), getAllCarts)
    .post(Authentication, Authorization(["user"]), addProductToMyCart);



router.route("/:id")
    .get(Authentication, Authorization(["user"]), getCartOfUser)
    .patch(Authentication, Authorization(["user"]), updateQuantity)
    .delete(Authentication, Authorization(["user"]), deleteProductFromMyCart);





export default router;