import { Router } from 'express';
import { getAllWishlistOfSpecificUser, addProductToWishlist, deleteProductFromWishlist } from './wishlist.service.js';
import { Authentication, Authorization } from '../user/user.auth.js';





const router = Router();


router.route("/").get(Authentication, Authorization(["user"]), getAllWishlistOfSpecificUser);


router.route("/:id")
    .post(Authentication, Authorization(["user"]), addProductToWishlist)
    .delete(Authentication, Authorization(["user"]), deleteProductFromWishlist);



export default router;