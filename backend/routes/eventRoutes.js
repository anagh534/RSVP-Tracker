const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const authMiddleware = require('../middleware/auth');
const { createEventValidation, rsvpValidation } = require('../validators/eventValidator');
const validate = require('../validators/validate');

router.get('/', eventController.getAllEvents);
router.get('/:id', eventController.getEventById);

// Protected routes
router.use(authMiddleware);
router.post('/', createEventValidation, validate, eventController.createEvent);
router.put('/:id', createEventValidation, validate, eventController.updateEvent);
router.delete('/:id', eventController.deleteEvent);

// RSVP Route
router.post('/:id/rsvp', rsvpValidation, validate, eventController.rsvpToEvent);

module.exports = router;
