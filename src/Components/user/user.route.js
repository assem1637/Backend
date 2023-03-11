import { Router } from 'express';
import { getAllUsers, createNewUser, getSpecificUser, updateSpecificUser, deleteSpecificUser, changePassword } from './user.service.js';
import { signup, signin, Authentication, Authorization, confirmation, sendResetCode, verifyResetCode, changePasswordAfterConfirmResetCode } from './user.auth.js';
import { uploadSingleImage } from '../../Utils/uploadImage.js';






const router = Router();



router.route("/").get(Authentication, Authorization(["admin"]), getAllUsers).post(Authentication, Authorization(["admin"]), uploadSingleImage("profileImg"), createNewUser);
router.route("/:id").get(Authentication, Authorization(["admin"]), getSpecificUser).put(Authentication, Authorization(["admin", "user"]), uploadSingleImage("profileImg"), updateSpecificUser).delete(Authentication, Authorization(["admin"]), deleteSpecificUser).patch(Authentication, Authorization(["admin", "user"]), changePassword);



router.post("/signup", uploadSingleImage("profileImg"), signup);
router.post("/signin", signin);
router.get("/confirm/:token", confirmation);


router.post("/sendResetCode", sendResetCode);
router.post("/verifyResetCode", verifyResetCode);
router.post("/changePasswordAfterConfirmResetCode", changePasswordAfterConfirmResetCode);


export default router;