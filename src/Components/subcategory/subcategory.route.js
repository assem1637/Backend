import { Router } from 'express';
import { getAllSubCategories, createNewSubCategory, getSpecificSubCategory, updateSpecificSubCategory, deleteSpecificSubCategory } from './subcategory.service.js';
import { Authentication, Authorization } from '../user/user.auth.js';





const router = Router({ mergeParams: true });



router.route("/").get(getAllSubCategories).post(Authentication, Authorization(["admin"]), createNewSubCategory);
router.route("/:id").get(getSpecificSubCategory).put(Authentication, Authorization(["admin"]), updateSpecificSubCategory).delete(Authentication, Authorization(["admin"]), deleteSpecificSubCategory);





export default router;