import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
}, { timestamps: true });

const artistSchema = new mongoose.Schema({
  name: { type: String, required: true },
  latestRank: { type: Number, required: true },
  previousRank: { type: Number, required: true },
  didEnterTopTen: { type: Boolean, default: false },
  didEnterTopFifty: { type: Boolean, default: false },
  hadNumberOne: { type: Boolean, default: false },
  isDead: { type: Boolean, default: false },
}, { timestamps: true });

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  roster: [{
    artistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist' },
    isActive: { type: Boolean, default: true },
    dateAcquired: { type: Date, default: Date.now },
    isCanceled: { type: Boolean, default: false }
  }]
}, { timestamps: true });

const draftSchema = new mongoose.Schema({
  status: { type: String, enum: ['pending', 'active', 'complete'], default: 'pending' },
  currentRound: { type: Number, default: 1 },
  currentPick: { type: Number, default: 1 },
  pickOrder: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Team' }],
  picks: [{
    teamId: { type: mongoose.Schema.Types.ObjectId, ref: 'Team' },
    artistId: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist' },
    round: Number,
    pickNumber: Number
  }]
}, { timestamps: true });

export const User = mongoose.model('User', userSchema);
export const Artist = mongoose.model('Artist', artistSchema);
export const Team = mongoose.model('Team', teamSchema);
export const Draft = mongoose.model('Draft', draftSchema);