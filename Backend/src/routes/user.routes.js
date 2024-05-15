import { Router } from "express";
import {userRegister, userLogin, logOutUser} from "../controllers/user.controllers.js";
import {upload} from "../middleware/multer.middleware.js";
import {verifyJwd} from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
    {
        name:"avatar",
        maxCount: 1,
    }
]),
    userRegister
)

router.route("/login").post(
    userLogin
)

router.route("/logout").post(verifyJwd, logOutUser)

export { router}