const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RSVP = sequelize.define('RSVP', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  status: {
    type: DataTypes.ENUM('going', 'maybe', 'declined'),
    allowNull: false,
  }
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'eventId']
    }
  ]
});

module.exports = RSVP;
