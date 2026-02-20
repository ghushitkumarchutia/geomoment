const mongoose = require('mongoose');
const { TAG_TYPES } = require('../config/constants');

const momentSchema = new mongoose.Schema(
  {
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    tag: {
      type: String,
      enum: {
        values: TAG_TYPES,
        message: '{VALUE} is not a valid tag type',
      },
      required: [true, 'Tag is required'],
    },
    dayOfWeek: {
      type: Number,
      required: true,
      min: [-1, 'dayOfWeek must be -1 to 6'],
      max: [6, 'dayOfWeek must be -1 to 6'],
    },
    hourSlot: {
      type: Number,
      required: true,
      min: [-1, 'hourSlot must be -1 to 23'],
      max: [23, 'hourSlot must be -1 to 23'],
    },
    geohashCell: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      default: '',
      maxlength: [80, 'Note cannot exceed 80 characters'],
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

momentSchema.index({ location: '2dsphere' });
momentSchema.index({ geohashCell: 1, dayOfWeek: 1, hourSlot: 1 });
momentSchema.index({ userId: 1 });
momentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Moment', momentSchema);
