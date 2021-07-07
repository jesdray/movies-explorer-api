const router = require("express").Router();

router.use("/", require("./users"));
router.use("/movies", require("./movies"));

module.exports = router;
