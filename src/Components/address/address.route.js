import { Router } from 'express';
import { getAllAddress, createNewAddress, getSpecificAddress, updateSpcificAddress, deleteSpecificAddress } from './address.service.js';
import { Authentication, Authorization } from '../user/user.auth.js';





const router = Router();



router.route("/")
    .get(Authentication, Authorization(["user"]), getAllAddress)
    .post(Authentication, Authorization(["user"]), createNewAddress);


router.route("/:id")
    .get(Authentication, Authorization(["user"]), getSpecificAddress)
    .put(Authentication, Authorization(["user"]), updateSpcificAddress)
    .delete(Authentication, Authorization(["user"]), deleteSpecificAddress);



export default router;