const router = require('express').Router();
const controller = require('../controllers');
const multer = require('multer');
const upload = multer();

router.post('/extractTemperature', upload.single('file'), controller.extractController.extractMeasurements);

module.exports = router;