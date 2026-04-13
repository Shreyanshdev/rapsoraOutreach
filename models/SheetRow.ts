import mongoose, { Schema, model, models } from 'mongoose';

const SheetRowSchema = new Schema({
  sheetId: {
    type: Schema.Types.ObjectId,
    ref: 'Sheet',
    required: true,
  },
  data: {
    type: Map,
    of: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

const SheetRow = models.SheetRow || model('SheetRow', SheetRowSchema);

export default SheetRow;
