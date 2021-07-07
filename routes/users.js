const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const cors = require("cors");
const {
  updateProfile, getUser,
} = require("../controllers/users");
const auth = require("../middlewares/auth");

router.use(cors({
  origin: "https://movies-f.students.nomoredomains.club/",
}));

router.get("/users/me", auth, getUser);

router.patch("/users/me", auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateProfile);

module.exports = router;
