import mongoose, { Schema, model, models } from 'mongoose';

const SheetSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  columns: [{
    type: String,
    required: true,
  }],
  type: {
    type: String,
    enum: ['fixed', 'custom'],
    default: 'custom',
  },
  uid: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Sheet = models.Sheet || model('Sheet', SheetSchema);

export default Sheet;
