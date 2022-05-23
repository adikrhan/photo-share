const express = require("express");
const usersCtrl = require("../controllers/users-controllers");
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

router.get("/", usersCtrl.getUsers);

router.get("/:uid", usersCtrl.getUserById);

router.post("/signup", usersCtrl.signup);

router.post("/login", usersCtrl.login);

router.use(checkAuth);
router.patch("/:uid", usersCtrl.updateUser);
router.delete("/:uid", usersCtrl.deleteUser);

module.exports = router;
