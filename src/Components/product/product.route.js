import { Router } from 'express';
import { getAllProducts, createNewProduct, getSpecificProduct, updateSpecificProduct, deleteSpecificProduct } from './product.service.js';
import { uploadFieldsImage } from '../../Utils/uploadImage.js';



const path = [{ name: 'imageCover', maxCount: 1 }, { name: 'images', maxCount: 4 }];


const router = Router();



router.route("/").get(getAllProducts).post(uploadFieldsImage(path), createNewProduct);
router.route("/:id").get(getSpecificProduct).put(uploadFieldsImage(path), updateSpecificProduct).delete(deleteSpecificProduct);




export default router;