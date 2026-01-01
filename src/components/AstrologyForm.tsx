'use client';

import { useState } from 'react';

interface AstrologyFormProps {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

interface FormData {
  name: string;
  dateOfBirth: string;
  timeOfBirth?: string;
  placeOfBirth?: string;
  rashi: string;
  birthStar: string;
}

interface PossibleNakshatra {
  name: string;
  lord: string;
  deity: string;
}

interface PossibleRashi {
  name: string;
  english: string;
  lord: string;
  fullName: string;
}

interface TimePosition {
  time: string;
  label: string;
  rashi: { name: string; english: string; fullName: string };
  nakshatra: { name: string; pada: number; lord: string; deity: string; fullName: string };
  moonDegree: string;
}

const rashiOptions = [
  'Mesha (Aries)',
  'Vrishabha (Taurus)',
  'Mithuna (Gemini)',
  'Karka (Cancer)',
  'Simha (Leo)',
  'Kanya (Virgo)',
  'Tula (Libra)',
  'Vrishchika (Scorpio)',
  'Dhanu (Sagittarius)',
  'Makara (Capricorn)',
  'Kumbha (Aquarius)',
  'Meena (Pisces)',
];

const birthStarOptions = [
  'Ashwini',
  'Bharani',
  'Krittika',
  'Rohini',
  'Mrigashira',
  'Ardra',
  'Punarvasu',
  'Pushya',
  'Ashlesha',
  'Magha',
  'Purva Phalguni',
  'Uttara Phalguni',
  'Hasta',
  'Chitra',
  'Swati',
  'Vishakha',
  'Anuradha',
  'Jyeshtha',
  'Mula',
  'Purva Ashadha',
  'Uttara Ashadha',
  'Shravana',
  'Dhanishta',
  'Shatabhisha',
  'Purva Bhadrapada',
  'Uttara Bhadrapada',
  'Revati',
];

export default function AstrologyForm({ onSubmit, isLoading }: AstrologyFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    dateOfBirth: '',
    timeOfBirth: '',
    placeOfBirth: '',
    rashi: '',
    birthStar: '',
  });
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationResult, setCalculationResult] = useState<string | null>(null);
  const [knowsDetails, setKnowsDetails] = useState<boolean | null>(null);
  const [showPossibilities, setShowPossibilities] = useState(false);
  const [possibilities, setPossibilities] = useState<{
    possibleRashis: PossibleRashi[];
    possibleNakshatras: PossibleNakshatra[];
    timeWisePositions: TimePosition[];
  } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Include timeOfBirth and placeOfBirth if they were entered
    const submitData: FormData = {
      name: formData.name,
      dateOfBirth: formData.dateOfBirth,
      rashi: formData.rashi,
      birthStar: formData.birthStar,
    };
    if (formData.timeOfBirth) {
      submitData.timeOfBirth = formData.timeOfBirth;
    }
    if (formData.placeOfBirth) {
      submitData.placeOfBirth = formData.placeOfBirth;
    }
    onSubmit(submitData);
  };

  const calculateRashiNakshatra = async () => {
    if (!formData.dateOfBirth) {
      alert('Please enter date of birth');
      return;
    }

    setIsCalculating(true);
    setCalculationResult(null);
    setPossibilities(null);
    setShowPossibilities(false);

    try {
      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          dateOfBirth: formData.dateOfBirth,
          timeOfBirth: formData.timeOfBirth || null,
          placeOfBirth: formData.placeOfBirth,
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.isExact) {
          // Exact time provided - single result
          setFormData({
            ...formData,
            rashi: data.data.rashi,
            birthStar: data.data.birthStar,
          });
          setCalculationResult(data.data.explanation);
        } else {
          // No time provided - multiple possibilities
          setPossibilities({
            possibleRashis: data.data.possibleRashis,
            possibleNakshatras: data.data.possibleNakshatras,
            timeWisePositions: data.data.timeWisePositions,
          });
          setShowPossibilities(true);
          setCalculationResult(data.data.explanation);
        }
      } else {
        alert(data.error || 'Failed to calculate. Please try again.');
      }
    } catch {
      alert('Failed to calculate. Please try again.');
    } finally {
      setIsCalculating(false);
    }
  };

  const selectFromPossibilities = (rashi: string, nakshatra: string) => {
    setFormData({
      ...formData,
      rashi,
      birthStar: nakshatra,
    });
    setShowPossibilities(false);
  };

  const inputClass = "w-full px-4 py-3 bg-purple-900/50 border border-purple-500/30 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all";
  const selectClass = "w-full px-4 py-3 bg-purple-900/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all appearance-none cursor-pointer";

  // Initial question about knowing Rashi/Nakshatra
  if (knowsDetails === null) {
    return (
      <div className="space-y-6">
        <p className="text-purple-200 text-center mb-4">Do you know your Rashi (Moon Sign) and Birth Star (Nakshatra)?</p>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setKnowsDetails(true)}
            className="flex-1 py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-semibold rounded-lg shadow-lg transition-all duration-300"
          >
            Yes, I know
          </button>
          <button
            type="button"
            onClick={() => setKnowsDetails(false)}
            className="flex-1 py-4 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-lg shadow-lg transition-all duration-300"
          >
            No, Find for me
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm font-medium text-purple-200">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className={inputClass}
          placeholder="Enter your full name"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="dateOfBirth" className="block text-sm font-medium text-purple-200">
          Date of Birth
        </label>
        <input
          type="date"
          id="dateOfBirth"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          required
          className={inputClass}
        />
      </div>

      {/* Time and Place fields - shown for both paths */}
      <div className="space-y-2">
        <label htmlFor="timeOfBirth" className="block text-sm font-medium text-purple-200">
          Time of Birth <span className="text-yellow-400 text-xs">(Recommended for Lagna & Dasha calculation)</span>
        </label>
        <input
          type="time"
          id="timeOfBirth"
          name="timeOfBirth"
          value={formData.timeOfBirth}
          onChange={handleChange}
          className={inputClass}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="placeOfBirth" className="block text-sm font-medium text-purple-200">
          Place of Birth
        </label>
        <input
          type="text"
          id="placeOfBirth"
          name="placeOfBirth"
          value={formData.placeOfBirth}
          onChange={handleChange}
          className={inputClass}
          placeholder="Enter city/town name (e.g., Hyderabad)"
        />
      </div>

      {!knowsDetails && (
        <>
          <p className="text-xs text-purple-400 -mt-4">
            Without birth time, we will show all possible Nakshatras for that day
          </p>

          <button
            type="button"
            onClick={calculateRashiNakshatra}
            disabled={isCalculating || !formData.dateOfBirth}
            className="w-full py-3 px-6 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-semibold rounded-lg shadow-lg shadow-amber-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCalculating ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Calculating...
              </span>
            ) : (
              'Find My Rashi & Nakshatra'
            )}
          </button>

          {calculationResult && !showPossibilities && (
            <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg text-green-200 text-sm">
              {calculationResult}
            </div>
          )}

          {/* Show possibilities when time is not provided */}
          {showPossibilities && possibilities && (
            <div className="p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg space-y-4">
              <p className="text-yellow-200 text-sm font-medium">
                Without exact birth time, your Nakshatra could be one of the following.
                Select the one you know, or provide birth time for accurate calculation:
              </p>

              <div className="space-y-2">
                <p className="text-purple-200 text-xs font-medium">Possible Nakshatras:</p>
                <div className="flex flex-wrap gap-2">
                  {possibilities.possibleNakshatras.map((nak) => (
                    <button
                      key={nak.name}
                      type="button"
                      onClick={() => {
                        const matchingPosition = possibilities.timeWisePositions.find(
                          p => p.nakshatra.name === nak.name
                        );
                        if (matchingPosition) {
                          selectFromPossibilities(
                            matchingPosition.rashi.fullName,
                            matchingPosition.nakshatra.fullName
                          );
                        }
                      }}
                      className="px-3 py-2 bg-purple-600/50 hover:bg-purple-500/50 rounded-lg text-sm text-white transition-all"
                    >
                      {nak.name} <span className="text-xs text-purple-300">({nak.lord})</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 max-h-48 overflow-y-auto">
                <p className="text-purple-200 text-xs font-medium mb-2">Time-wise breakdown:</p>
                <div className="space-y-1">
                  {possibilities.timeWisePositions.map((pos, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => selectFromPossibilities(pos.rashi.fullName, pos.nakshatra.fullName)}
                      className="w-full text-left px-3 py-2 bg-purple-900/30 hover:bg-purple-800/50 rounded text-xs text-purple-200 transition-all"
                    >
                      <span className="text-purple-400">{pos.label}:</span> {pos.nakshatra.name} (Pada {pos.nakshatra.pada}) - {pos.rashi.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      <div className="space-y-2">
        <label htmlFor="rashi" className="block text-sm font-medium text-purple-200">
          Rashi (Moon Sign) {formData.rashi && <span className="text-green-400">✓</span>}
        </label>
        <select
          id="rashi"
          name="rashi"
          value={formData.rashi}
          onChange={handleChange}
          required
          className={selectClass}
        >
          <option value="" className="bg-purple-900">Select your Rashi</option>
          {rashiOptions.map((rashi) => (
            <option key={rashi} value={rashi} className="bg-purple-900">
              {rashi}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="birthStar" className="block text-sm font-medium text-purple-200">
          Birth Star (Nakshatra) {formData.birthStar && <span className="text-green-400">✓</span>}
        </label>
        <select
          id="birthStar"
          name="birthStar"
          value={formData.birthStar}
          onChange={handleChange}
          required
          className={selectClass}
        >
          <option value="" className="bg-purple-900">Select your Birth Star</option>
          {birthStarOptions.map((star) => (
            <option key={star} value={star} className="bg-purple-900">
              {star}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => {
            setKnowsDetails(null);
            setShowPossibilities(false);
            setPossibilities(null);
            setCalculationResult(null);
          }}
          className="py-4 px-6 bg-purple-800/50 hover:bg-purple-700/50 text-white font-medium rounded-lg border border-purple-500/30 transition-all duration-300"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isLoading || !formData.rashi || !formData.birthStar}
          className="flex-1 py-4 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-lg shadow-lg shadow-purple-500/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Consulting the Stars...
            </span>
          ) : (
            'Reveal My Jathakam'
          )}
        </button>
      </div>
    </form>
  );
}
