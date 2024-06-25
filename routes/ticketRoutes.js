const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { upload } = require('../config/uploadConfig'); // Corrected import

router.get('/getTickets', ticketController.getTickets);
router.post('/createTicket', upload.single('image'), ticketController.createTicket); // Updated to use upload middleware
router.post('/updateTicket', ticketController.updateTicket);

module.exports = router;
