import { Router } from 'express';
import { getAllUsers, createNewUser, getSpecificUser, updateSpecificUser, deleteSpecificUser } from './user.service.js';
import { signup, signin, confirmation, sendResetCode, verifyResetCode, changePasswordAfterConfirmResetCode } from './user.auth.js';







const router = Router();



router.route("/").get(getAllUsers).post(createNewUser);
router.route("/:id").get(getSpecificUser).put(updateSpecificUser).delete(deleteSpecificUser);



router.post("/signup", signup);
router.post("/signin", signin);
router.get("/confirm/:token", confirmation);


router.post("/sendResetCode", sendResetCode);
router.post("/verifyResetCode", verifyResetCode);
router.post("/changePasswordAfterConfirmResetCode", changePasswordAfterConfirmResetCode);


export default router;