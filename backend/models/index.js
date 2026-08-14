const sequelize = require('../config/database');
const User = require('./User');
const Event = require('./Event');
const RSVP = require('./RSVP');
const bcrypt = require('bcrypt');

// Relationships

// A User can create many Events
User.hasMany(Event, { foreignKey: 'creatorId', as: 'createdEvents' });
Event.belongsTo(User, { foreignKey: 'creatorId', as: 'creator' });

// Users and Events are linked via RSVPs
User.belongsToMany(Event, { through: RSVP, foreignKey: 'userId', as: 'rsvpedEvents' });
Event.belongsToMany(User, { through: RSVP, foreignKey: 'eventId', as: 'attendees' });

// Explicit HasMany for direct query access
User.hasMany(RSVP, { foreignKey: 'userId' });
RSVP.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Event.hasMany(RSVP, { foreignKey: 'eventId' });
RSVP.belongsTo(Event, { foreignKey: 'eventId', as: 'event' });

// Unique constraint for RSVP handled in RSVP.js definition

const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection to the database has been established successfully.');
    await sequelize.sync({ alter: true });
    console.log('Database synchronized.');

    // Seed data
    const userCount = await User.count();
    if (userCount === 0) {
      console.log('Seeding initial users...');
      const password = await bcrypt.hash('password123', 10);
      await User.bulkCreate([
        { name: 'Alice', email: 'alice@example.com', password },
        { name: 'Bob', email: 'bob@example.com', password },
        { name: 'Charlie', email: 'charlie@example.com', password }
      ]);
      console.log('Seeded users.');
    }

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

module.exports = {
  sequelize,
  syncDatabase,
  User,
  Event,
  RSVP,
};
