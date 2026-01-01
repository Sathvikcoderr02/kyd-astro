import mongoose, { Schema, Document } from 'mongoose';

export interface IPrediction extends Document {
  name: string;
  dateOfBirth: Date;
  rashi: string;
  birthStar: string;
  predictions: {
    summary?: { headline: string; traits: string[] };
    personality?: { title: string; points: string[]; insight: string };
    nakshatra?: { title: string; deity: string; lord: string; points: string[]; insight: string };
    mental?: { title: string; points: string[] };
    career?: { title: string; bestFields: string[]; strengths: string[]; advice: string };
    wealth?: { title: string; points: string[]; insight: string };
    relationships?: { title: string; points: string[]; idealPartner: string };
    health?: { title: string; strengths: string[]; cautions: string[]; advice: string };
    challenges?: { title: string; points: string[]; remedy: string };
    lifePath?: { title: string; earlyLife: string; midLife: string; laterLife: string; peakYears: string };
    spirituality?: { title: string; points: string[]; deity: string; mantra: string };
    remedies?: { title: string; gemstone: string; color: string; day: string; fasting: string; charity: string; tips: string[] };
    timing?: { title: string; careerRise: string; marriage: string; saturnMaturity: string; luckyYears: string[] };
    // Legacy format support
    past?: string;
    present?: string;
    future?: string;
  };
  createdAt: Date;
}

const PredictionSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: true,
  },
  rashi: {
    type: String,
    required: true,
  },
  birthStar: {
    type: String,
    required: true,
  },
  predictions: {
    type: Schema.Types.Mixed,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Prediction || mongoose.model<IPrediction>('Prediction', PredictionSchema);
