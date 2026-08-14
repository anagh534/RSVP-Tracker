const { User, Event, RSVP, sequelize } = require('./models');
const bcrypt = require('bcrypt');

const seedData = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB. Seeding sample data for pagination...');
    
    // Make sure we have some users
    let users = await User.findAll();
    if (users.length === 0) {
      const password = await bcrypt.hash('password123', 10);
      users = await User.bulkCreate([
        { name: 'Seed 1', email: 'seed1@example.com', password },
        { name: 'Seed 2', email: 'seed2@example.com', password },
      ]);
    }

    const events = [];
    for(let i = 1; i <= 35; i++) {
      events.push({
        title: `Community Meetup ${i}`,
        description: `This is an automatically generated sample event for pagination testing. This is event number ${i}.`,
        date: new Date(Date.now() + (i * 2) * 86400000), // Spaced out in the future
        location: `Sample Venue ${i}`,
        creatorId: users[i % users.length].id
      });
    }
    
    const createdEvents = await Event.bulkCreate(events);
    
    // Add random RSVPs
    for(let i = 0; i < createdEvents.length; i++) {
      if (i % 2 === 0) {
        await RSVP.create({
          userId: users[0].id,
          eventId: createdEvents[i].id,
          status: 'going'
        });
      }
    }
    
    console.log('Successfully seeded 35 events and RSVPs!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
