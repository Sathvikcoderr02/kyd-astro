'use client';

import { useState } from 'react';
import AstrologyForm from '@/components/AstrologyForm';
import PredictionDisplay from '@/components/PredictionDisplay';
import CelestialBackground from '@/components/CelestialBackground';
import { Sun, Sparkles, Moon, Star, Globe } from 'lucide-react';

interface PredictionData {
  name: string;
  dateOfBirth: string;
  rashi: string;
  birthStar: string;
  timeOfBirth?: string;
  placeOfBirth?: string;
  hasTime?: boolean;
  predictions: {
    summary?: { headline: string; traits: string[] };
    personality?: { title: string; points: string[]; insight: string };
    nakshatra?: { title: string; deity: string; lord: string; points: string[]; insight: string };
    lagna?: { title: string; sign: string; points: string[]; insight: string };
    currentDasha?: { title: string; mahadasha: string; antardasha: string; effects: string[]; advice: string };
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
    chartData?: {
      hasTime: boolean;
      lagna?: { name: string; english: string; lord: string; fullName: string };
      dasha?: {
        ageInYears: number;
        mahadasha: { planet: string; planetEnglish: string; remainingYears: number };
        antardasha: { planet: string; planetEnglish: string };
        upcomingDashas: Array<{ planet: string; ageRange: string; isCurrent: boolean }>;
      };
    };
    // Legacy format
    past?: string;
    present?: string;
    future?: string;
  };
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [predictionData, setPredictionData] = useState<PredictionData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: {
    name: string;
    dateOfBirth: string;
    rashi: string;
    birthStar: string;
    timeOfBirth?: string;
    placeOfBirth?: string;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate prediction');
      }

      setPredictionData(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPredictionData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Celestial Background with planets, stars, sun, moon */}
      <CelestialBackground />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="py-6 px-6">
          <div className="flex items-center justify-start">
            <div className="flex items-center gap-4">
              {/* Impressive Logo - Sun & Moon Combined */}
              <div className="relative w-14 h-14 md:w-16 md:h-16">
                {/* Outer glow ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400 via-purple-500 to-indigo-600 opacity-60 blur-md animate-pulse"></div>

                {/* Main logo container */}
                <div className="relative w-full h-full rounded-full bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 border-2 border-amber-400/50 shadow-xl shadow-purple-500/40 overflow-hidden">
                  {/* Sun half */}
                  <div className="absolute top-1 left-1 w-6 h-6 md:w-7 md:h-7">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-300 via-orange-400 to-amber-500 shadow-lg shadow-amber-400/50">
                      {/* Sun rays */}
                      <div className="absolute inset-0 animate-spin" style={{ animationDuration: '20s' }}>
                        {[...Array(8)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-0.5 h-2 bg-amber-300/70 left-1/2 -translate-x-1/2 -top-1"
                            style={{ transform: `translateX(-50%) rotate(${i * 45}deg)`, transformOrigin: 'center 14px' }}
                          ></div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Moon crescent */}
                  <div className="absolute bottom-1 right-1 w-5 h-5 md:w-6 md:h-6">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-200 via-slate-100 to-slate-300 shadow-lg shadow-slate-300/30">
                      <div className="absolute top-0.5 left-0.5 w-3 h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900"></div>
                    </div>
                  </div>

                  {/* Center star */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <Star className="w-3 h-3 md:w-4 md:h-4 text-purple-300 fill-purple-300 animate-pulse" />
                  </div>

                  {/* Tiny orbiting stars */}
                  <div className="absolute inset-0 animate-spin" style={{ animationDuration: '15s' }}>
                    <div className="absolute top-2 right-3 w-1 h-1 rounded-full bg-white/80"></div>
                    <div className="absolute bottom-3 left-2 w-0.5 h-0.5 rounded-full bg-purple-300/80"></div>
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl md:text-4xl font-black tracking-wider">
                    <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent drop-shadow-lg">K</span>
                    <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">Y</span>
                    <span className="bg-gradient-to-r from-indigo-300 via-blue-200 to-indigo-400 bg-clip-text text-transparent drop-shadow-lg">D</span>
                  </h1>
                  <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-amber-400 animate-pulse" />
                </div>
                <span className="text-xs md:text-sm text-purple-300/90 tracking-widest uppercase font-medium">
                  Know Your Destiny
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Section */}
        <main className="flex-1 flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-4xl">
            {!predictionData ? (
              <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-purple-500/20 shadow-2xl shadow-purple-900/30">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600/20 rounded-full mb-4">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <span className="text-purple-200 text-sm">Vedic Astrology Predictions</span>
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                    Discover Your Jathakam
                  </h2>
                  <p className="text-purple-300 max-w-md mx-auto">
                    Enter your birth details for personalized Vedic astrological insights based on your Rashi, Nakshatra, and Dasha periods
                  </p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg text-red-200 text-center">
                    {error}
                  </div>
                )}

                <AstrologyForm onSubmit={handleSubmit} isLoading={isLoading} />

                {/* Features */}
                <div className="mt-8 pt-8 border-t border-purple-500/20">
                  <div className="grid grid-cols-4 gap-3">
                    <div className="text-center">
                      <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-purple-600/30 flex items-center justify-center">
                        <Moon className="w-5 h-5 text-purple-300" />
                      </div>
                      <p className="text-xs text-purple-300">Rashi</p>
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-purple-600/30 flex items-center justify-center">
                        <Star className="w-5 h-5 text-purple-300" />
                      </div>
                      <p className="text-xs text-purple-300">Nakshatra</p>
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-purple-600/30 flex items-center justify-center">
                        <Sun className="w-5 h-5 text-purple-300" />
                      </div>
                      <p className="text-xs text-purple-300">Lagna</p>
                    </div>
                    <div className="text-center">
                      <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-purple-600/30 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-purple-300" />
                      </div>
                      <p className="text-xs text-purple-300">Dasha</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <PredictionDisplay data={predictionData} onReset={handleReset} />
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="py-6 px-4 text-center">
          <p className="text-purple-400/60 text-sm">
            © 2026 7SS Pvt Ltd. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
