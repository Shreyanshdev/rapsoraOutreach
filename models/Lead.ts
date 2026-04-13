import mongoose, { Schema, model, models } from 'mongoose';

const LeadSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  industry: {
    type: String,
    required: false,
    default: 'General',
  },
  uid: {
    type: String,
    required: true, // This will be the user id from Auth.js
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Lead = models.Lead || model('Lead', LeadSchema);

export default Lead;
