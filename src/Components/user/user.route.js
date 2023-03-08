import { Router } from 'express';
import { getAllUsers, createNewUser, getSpecificUser, updateSpecificUser, deleteSpecificUser, changePassword } from './user.service.js';
import { signup, signin, confirmation, sendResetCode, verifyResetCode, changePasswordAfterConfirmResetCode } from './user.auth.js';
import { uploadSingleImage } from '../../Utils/uploadImage.js';






const router = Router();



router.route("/").get(getAllUsers).post(uploadSingleImage("profileImg"), createNewUser);
router.route("/:id").get(getSpecificUser).put(uploadSingleImage("profileImg"), updateSpecificUser).delete(deleteSpecificUser).patch(changePassword);



router.post("/signup", uploadSingleImage("profileImg"), signup);
router.post("/signin", signin);
router.get("/confirm/:token", confirmation);


router.post("/sendResetCode", sendResetCode);
router.post("/verifyResetCode", verifyResetCode);
router.post("/changePasswordAfterConfirmResetCode", changePasswordAfterConfirmResetCode);


export default router;