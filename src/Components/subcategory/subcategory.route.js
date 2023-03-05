import { Router } from 'express';
import { getAllSubCategories, createNewSubCategory, getSpecificSubCategory, updateSpecificSubCategory, deleteSpecificSubCategory } from './subcategory.service.js';






const router = Router({ mergeParams: true });



router.route("/").get(getAllSubCategories).post(createNewSubCategory);
router.route("/:id").get(getSpecificSubCategory).put(updateSpecificSubCategory).delete(deleteSpecificSubCategory);





export default router;