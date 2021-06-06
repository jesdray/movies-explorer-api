const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");
const {
  updateProfile, getUser, login, createUser,
} = require("../controllers/users");
const auth = require("../middlewares/auth");

router.post("/singin", celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.post("/singup", celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
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
