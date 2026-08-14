const eventService = require('../services/eventService');
const rsvpService = require('../services/rsvpService');

exports.getAllEvents = async (req, res) => {
  try {
    const events = await eventService.getAllEvents();
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await eventService.getEventById(req.params.id);
    res.status(200).json(event);
  } catch (error) {
    if (error.message === 'Event not found') return res.status(404).json({ error: error.message });
    res.status(500).json({ error: error.message });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const newEvent = await eventService.createEvent(req.body, req.user.id);
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const updatedEvent = await eventService.updateEvent(req.params.id, req.body, req.user.id);
    res.status(200).json(updatedEvent);
  } catch (error) {
    if (error.message === 'Event not found') return res.status(404).json({ error: error.message });
    if (error.message === 'Unauthorized to update this event') return res.status(403).json({ error: error.message });
    res.status(400).json({ error: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    await eventService.deleteEvent(req.params.id, req.user.id);
    res.status(204).send();
  } catch (error) {
    if (error.message === 'Event not found') return res.status(404).json({ error: error.message });
    if (error.message === 'Unauthorized to delete this event') return res.status(403).json({ error: error.message });
    res.status(500).json({ error: error.message });
  }
};

exports.rsvpToEvent = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['going', 'maybe', 'declined'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }
    const rsvp = await rsvpService.submitRSVP(req.user.id, req.params.id, status);
    res.status(200).json(rsvp);
  } catch (error) {
    if (error.message === 'Event not found') return res.status(404).json({ error: error.message });
    res.status(500).json({ error: error.message });
  }
};
