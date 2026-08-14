const { RSVP, Event } = require('../models');

exports.submitRSVP = async (userId, eventId, status) => {
  const event = await Event.findByPk(eventId);
  if (!event) throw new Error('Event not found');

  // Find existing RSVP or create new one
  let rsvp = await RSVP.findOne({ where: { userId, eventId } });
  
  if (rsvp) {
    rsvp.status = status;
    await rsvp.save();
  } else {
    rsvp = await RSVP.create({ userId, eventId, status });
  }

  return rsvp;
};
