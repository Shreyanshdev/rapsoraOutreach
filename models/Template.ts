import mongoose, { Schema, model, models } from 'mongoose';

const TemplateSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name for this blueprint'],
  },
  subject: {
    type: String,
    required: [true, 'Please provide a subject line'],
  },
  bodyHTML: {
    type: String,
    required: [true, 'Please provide the HTML content'],
  },
  uid: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

const Template = models.Template || model('Template', TemplateSchema);

export default Template;
