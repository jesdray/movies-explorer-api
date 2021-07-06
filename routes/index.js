const router = require("express").Router();
const cors = require("cors");

router.use(cors());

router.use("/", require("./users"));
router.use("/movies", require("./movies"));

module.exports = router;
