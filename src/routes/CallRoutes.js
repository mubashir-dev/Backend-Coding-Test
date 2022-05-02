//CallsRoute
const express = require('express');
const router = express.Router();
const CallsController = require('../controllers/CallsController');

router.post('/makeCall', CallsController.makeCall);
router.post('/userInput', CallsController.processUserInput);
router.get('/forwardCall', CallsController.forwardCall);
router.get('/voiceMessage', CallsController.voiceMessage);
router.post('/hangup', CallsController.hangUpCall);

module.exports = router