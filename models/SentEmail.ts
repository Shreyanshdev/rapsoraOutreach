import mongoose, { Schema, model, models } from 'mongoose';

const SentEmailSchema = new Schema({
  to: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  bodyHTML: {
    type: String,
    required: true,
  },
  resendId: {
    type: String,
  },
  status: {
    type: String,
    enum: ['transmitted', 'delivered', 'opened', 'replied', 'bounced'],
    default: 'transmitted',
  },
  uid: {
    type: String, // ID of the person who sent it
  },
  userName: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const SentEmail = models.SentEmail || model('SentEmail', SentEmailSchema);

export default SentEmail;
