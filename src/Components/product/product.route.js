import { Router } from 'express';
import { getAllProducts, createNewProduct, getSpecificProduct, updateSpecificProduct, deleteSpecificProduct } from './product.service.js';
import { uploadFieldsImage } from '../../Utils/uploadImage.js';
import { Authentication, Authorization } from '../user/user.auth.js';


const path = [{ name: 'imageCover', maxCount: 1 }, { name: 'images', maxCount: 4 }];


const router = Router();



router.route("/").get(getAllProducts).post(Authentication, Authorization(["admin"]), uploadFieldsImage(path), createNewProduct);
router.route("/:id").get(getSpecificProduct).put(Authentication, Authorization(["admin"]), uploadFieldsImage(path), updateSpecificProduct).delete(Authentication, Authorization(["admin"]), deleteSpecificProduct);




export default router;