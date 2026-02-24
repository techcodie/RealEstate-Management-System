const express = require("express");
const router = express.Router();
const {
    calculate,
    createProperty,
    getProperties,
    deleteProperty,
    getAnalytics,
} = require("../controllers/propertyController");

router.post("/calculate", calculate);
router.post("/", createProperty);
router.get("/analytics", getAnalytics);
router.get("/", getProperties);
router.delete("/:id", deleteProperty);

module.exports = router;
