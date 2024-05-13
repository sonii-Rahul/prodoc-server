import { Router } from "express";
import { logOutUser, loginUser,registerUser,verifyLogin} from "../controlers/user.js";
import {verifyUser} from "../middleware/authmiddleware.js"



const router = Router()

router.route("/login").post(loginUser);
router.route("/register").post(registerUser);
router.route("/verify").get(verifyLogin);


//secured routes
router.route("/logout").post(logOutUser)
export default router




