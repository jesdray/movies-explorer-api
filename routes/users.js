const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const {
  updateProfile, getUser, login, createUser,
} = require("../controllers/users");

const auth = require("../middlewares/auth");

router.post("/signin", celebrate({
  body: Joi.object().keys({
    password: Joi.string().required(),
    email: Joi.string().required().email(),
  }),
}), login);

router.post("/signup", celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    password: Joi.string().min(4).required(),
    email: Joi.string().required().email(),
  }),
}), createUser);

router.get("/users/me", auth, getUser);

router.patch("/users/me", auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateProfile);

module.exports = router;
