const { Event, User, RSVP } = require('../models');

exports.getAllEvents = async (page = 1, limit = 6) => {
  const offset = (page - 1) * limit;
  return await Event.findAndCountAll({
    limit,
    offset,
    order: [['date', 'ASC']],
    include: [
      { model: User, as: 'creator', attributes: ['id', 'name'] },
      { model: RSVP, as: 'RSVPs', include: [{ model: User, as: 'user', attributes: ['id', 'name'] }] }
    ]
  });
};

exports.getEventById = async (id) => {
  const event = await Event.findByPk(id, {
    include: [
      { model: User, as: 'creator', attributes: ['id', 'name'] },
      { model: RSVP, as: 'RSVPs', include: [{ model: User, as: 'user', attributes: ['id', 'name'] }] }
    ]
  });
  if (!event) throw new Error('Event not found');
  return event;
};

exports.createEvent = async (eventData, userId) => {
  return await Event.create({
    ...eventData,
    creatorId: userId
  });
};

exports.updateEvent = async (eventId, eventData, userId) => {
  const event = await Event.findByPk(eventId);
  if (!event) throw new Error('Event not found');
  if (event.creatorId !== userId) throw new Error('Unauthorized to update this event');

  return await event.update(eventData);
};

exports.deleteEvent = async (eventId, userId) => {
  const event = await Event.findByPk(eventId);
  if (!event) throw new Error('Event not found');
  if (event.creatorId !== userId) throw new Error('Unauthorized to delete this event');

  await event.destroy();
  return true;
};
