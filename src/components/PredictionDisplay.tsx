'use client';

import { useState } from 'react';
import {
  Globe,
  Clock,
  Brain,
  Briefcase,
  Route,
  Heart,
  Star,
  Sun,
  Moon,
  Sparkles,
  Users,
  Activity,
  AlertTriangle,
  Gem,
  Calendar,
  TrendingUp,
  Wallet,
  Target,
  Zap,
  Award,
  Flame,
  Shield
} from 'lucide-react';

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
        upcomingDashas: Array<{ planet: string; planetEnglish?: string; ageRange: string; isCurrent: boolean }>;
      };
    };
    // Legacy format support
    past?: string;
    present?: string;
    future?: string;
  };
}

interface PredictionDisplayProps {
  data: PredictionData;
  onReset: () => void;
}

type TabId = 'overview' | 'personality' | 'career' | 'life' | 'remedies' | 'dasha';

export default function PredictionDisplay({ data, onReset }: PredictionDisplayProps) {
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const p = data.predictions;
  const chartData = p.chartData;
  const hasTime = chartData?.hasTime || false;

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Globe className="w-4 h-4" /> },
    { id: 'dasha', label: 'Dasha', icon: <Clock className="w-4 h-4" /> },
    { id: 'personality', label: 'Personality', icon: <Brain className="w-4 h-4" /> },
    { id: 'career', label: 'Career', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'life', label: 'Life Path', icon: <Route className="w-4 h-4" /> },
    { id: 'remedies', label: 'Remedies', icon: <Heart className="w-4 h-4" /> },
  ];

  const Section = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
    <div className="mb-8 bg-purple-900/30 rounded-xl p-6 border border-purple-500/20">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
        <span className="text-purple-400">{icon}</span> {title}
      </h3>
      {children}
    </div>
  );

  const BulletList = ({ items }: { items: string[] }) => (
    <ul className="space-y-3">
      {items.map((item, idx) => (
        <li key={idx} className="text-purple-100 text-base flex items-start gap-3">
          <span className="text-purple-400 mt-1">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );

  const InsightBox = ({ text }: { text: string }) => (
    <div className="mt-4 p-4 bg-indigo-600/20 rounded-lg border-l-4 border-indigo-400">
      <p className="text-indigo-200 text-base">{text}</p>
    </div>
  );

  const TagList = ({ items }: { items: string[] }) => (
    <div className="flex flex-wrap gap-2">
      {items.map((item, idx) => (
        <span key={idx} className="px-4 py-1.5 bg-purple-600/40 rounded-full text-sm text-purple-200">
          {item}
        </span>
      ))}
    </div>
  );

  const WarningBox = ({ text }: { text: string }) => (
    <div className="mt-4 p-4 bg-yellow-600/20 rounded-lg border-l-4 border-yellow-400">
      <p className="text-yellow-200 text-base">{text}</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-gradient-to-br from-purple-800/50 to-indigo-800/50 rounded-xl p-8 border border-purple-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white">{data.name}</h2>
            <p className="text-purple-300 text-base mt-2">
              {new Date(data.dateOfBirth).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
              {data.timeOfBirth && ` at ${data.timeOfBirth}`}
              {data.placeOfBirth && ` - ${data.placeOfBirth}`}
            </p>
            <div className="flex flex-wrap gap-3 mt-3">
              <span className="px-4 py-1.5 bg-purple-600/40 rounded-full text-sm text-white flex items-center gap-2">
                <Moon className="w-4 h-4" /> {data.rashi}
              </span>
              <span className="px-4 py-1.5 bg-indigo-600/40 rounded-full text-sm text-white flex items-center gap-2">
                <Star className="w-4 h-4" /> {data.birthStar}
              </span>
              {hasTime && chartData?.lagna && (
                <span className="px-4 py-1.5 bg-orange-600/40 rounded-full text-sm text-white flex items-center gap-2">
                  <Sun className="w-4 h-4" /> Lagna: {chartData.lagna.name}
                </span>
              )}
              {hasTime && chartData?.dasha && (
                <span className="px-4 py-1.5 bg-green-600/40 rounded-full text-sm text-white flex items-center gap-2">
                  <Globe className="w-4 h-4" /> {chartData.dasha.mahadasha.planet} Dasha
                </span>
              )}
            </div>
          </div>
          {p.summary && (
            <div className="text-right">
              <p className="text-yellow-300 text-base italic">&quot;{p.summary.headline}&quot;</p>
            </div>
          )}
        </div>
        {p.summary?.traits && (
          <div className="mt-4">
            <TagList items={p.summary.traits} />
          </div>
        )}
        {!hasTime && (
          <div className="mt-5 p-4 bg-yellow-600/20 rounded-lg border border-yellow-500/30 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
            <p className="text-yellow-200 text-sm">
              <strong>Note:</strong> Birth time not provided. Lagna and exact Dasha periods cannot be calculated. Timing predictions are approximate.
            </p>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-purple-900/30 p-1.5 rounded-lg overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-max py-3 px-4 rounded-lg font-medium transition-all text-base flex items-center justify-center gap-2 ${activeTab === tab.id ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white' : 'text-purple-300 hover:text-white hover:bg-purple-800/50'}`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[500px]">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {p.personality && (
              <Section title={p.personality.title} icon={<Sparkles className="w-5 h-5" />}>
                <BulletList items={p.personality.points} />
                <InsightBox text={p.personality.insight} />
              </Section>
            )}
            {p.nakshatra && (
              <Section title={p.nakshatra.title} icon={<Star className="w-5 h-5" />}>
                <div className="flex gap-6 mb-4 text-sm">
                  <span className="text-purple-300">Deity: <span className="text-white font-medium">{p.nakshatra.deity}</span></span>
                  <span className="text-purple-300">Lord: <span className="text-white font-medium">{p.nakshatra.lord}</span></span>
                </div>
                <BulletList items={p.nakshatra.points} />
                <InsightBox text={p.nakshatra.insight} />
              </Section>
            )}
            {p.lagna && (
              <Section title={p.lagna.title} icon={<Sun className="w-5 h-5" />}>
                <div className="mb-4">
                  <span className="text-purple-300 text-sm">Lagna Sign: </span>
                  <span className="text-white font-medium text-base">{p.lagna.sign}</span>
                </div>
                {p.lagna.points && <BulletList items={p.lagna.points} />}
                {p.lagna.insight && (
                  hasTime ? <InsightBox text={p.lagna.insight} /> : <WarningBox text={p.lagna.insight} />
                )}
              </Section>
            )}
          </div>
        )}

        {activeTab === 'dasha' && (
          <div className="space-y-4">
            {/* Calculated Dasha from Chart */}
            {hasTime && chartData?.dasha && (
              <Section title="Your Current Planetary Periods" icon={<Globe className="w-5 h-5" />}>
                <div className="grid md:grid-cols-2 gap-5 mb-5">
                  <div className="p-5 bg-gradient-to-br from-purple-600/30 to-indigo-600/30 rounded-lg border border-purple-500/30">
                    <p className="text-purple-300 text-sm mb-1">Mahadasha (Main Period)</p>
                    <p className="text-white text-2xl font-bold">{chartData.dasha.mahadasha.planet}</p>
                    <p className="text-purple-200 text-base">{chartData.dasha.mahadasha.planetEnglish}</p>
                    <p className="text-green-300 text-sm mt-2">{chartData.dasha.mahadasha.remainingYears} years remaining</p>
                  </div>
                  <div className="p-5 bg-gradient-to-br from-indigo-600/30 to-blue-600/30 rounded-lg border border-indigo-500/30">
                    <p className="text-indigo-300 text-sm mb-1">Antardasha (Sub Period)</p>
                    <p className="text-white text-2xl font-bold">{chartData.dasha.antardasha.planet}</p>
                    <p className="text-indigo-200 text-base">{chartData.dasha.antardasha.planetEnglish}</p>
                  </div>
                </div>
                <div className="p-4 bg-purple-800/30 rounded-lg mb-5">
                  <p className="text-purple-300 text-sm">Current Age: <span className="text-white font-medium text-base">{chartData.dasha.ageInYears} years</span></p>
                </div>
                {chartData.dasha.upcomingDashas && (
                  <div>
                    <p className="text-purple-300 text-sm font-medium mb-3">Dasha Timeline:</p>
                    <div className="space-y-2">
                      {chartData.dasha.upcomingDashas.map((d, idx) => (
                        <div key={idx} className={`p-3 rounded-lg text-base flex justify-between items-center ${d.isCurrent ? 'bg-green-600/30 border border-green-500/30' : 'bg-purple-800/20'}`}>
                          <span className={d.isCurrent ? 'text-green-200 font-medium' : 'text-purple-200'}>
                            {d.planet} {d.planetEnglish && `(${d.planetEnglish})`}
                          </span>
                          <span className="text-purple-400 text-sm">Age {d.ageRange}</span>
                          {d.isCurrent && <span className="text-green-400 text-sm">Current</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </Section>
            )}

            {/* AI-generated Dasha Predictions */}
            {p.currentDasha && (
              <Section title={p.currentDasha.title} icon={<Clock className="w-5 h-5" />}>
                <div className="flex gap-4 mb-3 text-sm">
                  <span className="text-purple-300">Mahadasha: <span className="text-white font-medium">{p.currentDasha.mahadasha}</span></span>
                  <span className="text-purple-300">Antardasha: <span className="text-white font-medium">{p.currentDasha.antardasha}</span></span>
                </div>
                {p.currentDasha.effects && <BulletList items={p.currentDasha.effects} />}
                {p.currentDasha.advice && <InsightBox text={p.currentDasha.advice} />}
              </Section>
            )}

            {!hasTime && (
              <Section title="Dasha Information Unavailable" icon={<AlertTriangle className="w-5 h-5" />}>
                <p className="text-yellow-200 text-sm">
                  To calculate your exact Mahadasha and Antardasha periods, please provide your birth time.
                  The Dasha system requires precise Moon position at birth which depends on birth time.
                </p>
                <div className="mt-4 p-3 bg-purple-800/30 rounded-lg">
                  <p className="text-purple-200 text-sm">
                    <strong>What is Dasha?</strong> Vimshottari Dasha is a 120-year planetary period system that determines which planet influences your life at any given time.
                    It&apos;s crucial for timing predictions about career, marriage, health, and major life events.
                  </p>
                </div>
              </Section>
            )}
          </div>
        )}

        {activeTab === 'personality' && (
          <div className="space-y-4">
            {p.mental && (
              <Section title={p.mental.title} icon={<Brain className="w-5 h-5" />}>
                <BulletList items={p.mental.points} />
              </Section>
            )}
            {p.relationships && (
              <Section title={p.relationships.title} icon={<Users className="w-5 h-5" />}>
                <BulletList items={p.relationships.points} />
                <div className="mt-3 p-3 bg-pink-600/20 rounded-lg">
                  <p className="text-pink-200 text-sm"><strong>Ideal Partner:</strong> {p.relationships.idealPartner}</p>
                </div>
              </Section>
            )}
            {p.health && (
              <Section title={p.health.title} icon={<Activity className="w-5 h-5" />}>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-green-400 text-sm font-medium mb-2">Strengths</p>
                    <BulletList items={p.health.strengths} />
                  </div>
                  <div>
                    <p className="text-yellow-400 text-sm font-medium mb-2">Areas to Watch</p>
                    <BulletList items={p.health.cautions} />
                  </div>
                </div>
                <InsightBox text={p.health.advice} />
              </Section>
            )}
          </div>
        )}

        {activeTab === 'career' && (
          <div className="space-y-4">
            {p.career && (
              <Section title={p.career.title} icon={<Briefcase className="w-5 h-5" />}>
                <p className="text-purple-300 text-sm font-medium mb-2">Best Career Fields</p>
                <TagList items={p.career.bestFields} />
                <p className="text-purple-300 text-sm font-medium mt-4 mb-2">Your Strengths at Work</p>
                <BulletList items={p.career.strengths} />
                <InsightBox text={p.career.advice} />
              </Section>
            )}
            {p.wealth && (
              <Section title={p.wealth.title} icon={<Wallet className="w-5 h-5" />}>
                <BulletList items={p.wealth.points} />
                <InsightBox text={p.wealth.insight} />
              </Section>
            )}
            {p.timing && (
              <Section title={p.timing.title} icon={<Calendar className="w-5 h-5" />}>
                <div className="grid md:grid-cols-2 gap-4 text-base">
                  <div className="p-4 bg-purple-800/30 rounded-lg">
                    <p className="text-purple-400 text-sm">Career Rise</p>
                    <p className="text-white font-medium">{p.timing.careerRise}</p>
                  </div>
                  <div className="p-4 bg-purple-800/30 rounded-lg">
                    <p className="text-purple-400 text-sm">Marriage Timing</p>
                    <p className="text-white font-medium">{p.timing.marriage}</p>
                  </div>
                  <div className="p-4 bg-purple-800/30 rounded-lg">
                    <p className="text-purple-400 text-sm">Shani Maturity (Age 36)</p>
                    <p className="text-white font-medium">{p.timing.saturnMaturity}</p>
                  </div>
                  <div className="p-4 bg-purple-800/30 rounded-lg">
                    <p className="text-purple-400 text-sm">Lucky Years</p>
                    <p className="text-white font-medium">{p.timing.luckyYears?.join(', ')}</p>
                  </div>
                </div>
                {!hasTime && (
                  <WarningBox text="Timing predictions are approximate without birth time. Provide birth time for precise timing based on Dasha periods." />
                )}
              </Section>
            )}
          </div>
        )}

        {activeTab === 'life' && (
          <div className="space-y-4">
            {p.lifePath && (
              <Section title={p.lifePath.title} icon={<Route className="w-5 h-5" />}>
                <div className="space-y-4">
                  <div className="p-5 bg-blue-600/20 rounded-lg border-l-4 border-blue-400">
                    <p className="text-blue-300 text-sm font-medium mb-1">Early Life (0-25 years)</p>
                    <p className="text-blue-100 text-base">{p.lifePath.earlyLife}</p>
                  </div>
                  <div className="p-5 bg-green-600/20 rounded-lg border-l-4 border-green-400">
                    <p className="text-green-300 text-sm font-medium mb-1">Mid Life (25-50 years)</p>
                    <p className="text-green-100 text-base">{p.lifePath.midLife}</p>
                  </div>
                  <div className="p-5 bg-yellow-600/20 rounded-lg border-l-4 border-yellow-400">
                    <p className="text-yellow-300 text-sm font-medium mb-1">Later Life (50+ years)</p>
                    <p className="text-yellow-100 text-base">{p.lifePath.laterLife}</p>
                  </div>
                  <div className="p-4 bg-purple-600/30 rounded-lg text-center">
                    <p className="text-purple-300 text-sm">Peak Success Years</p>
                    <p className="text-white font-bold text-xl">{p.lifePath.peakYears}</p>
                  </div>
                </div>
              </Section>
            )}
            {p.challenges && (
              <Section title={p.challenges.title} icon={<Target className="w-5 h-5" />}>
                <BulletList items={p.challenges.points} />
                <InsightBox text={p.challenges.remedy} />
              </Section>
            )}
          </div>
        )}

        {activeTab === 'remedies' && (
          <div className="space-y-4">
            {p.spirituality && (
              <Section title={p.spirituality.title} icon={<Flame className="w-5 h-5" />}>
                <BulletList items={p.spirituality.points} />
                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  <div className="p-3 bg-orange-600/20 rounded-lg">
                    <p className="text-orange-300 text-xs">Recommended Deity</p>
                    <p className="text-white font-medium">{p.spirituality.deity}</p>
                  </div>
                  <div className="p-3 bg-orange-600/20 rounded-lg">
                    <p className="text-orange-300 text-xs">Beneficial Mantra</p>
                    <p className="text-white font-medium text-sm">{p.spirituality.mantra}</p>
                  </div>
                </div>
              </Section>
            )}
            {p.remedies && (
              <Section title={p.remedies.title} icon={<Gem className="w-5 h-5" />}>
                <div className="grid md:grid-cols-2 gap-3 mb-4">
                  <div className="p-3 bg-purple-800/40 rounded-lg">
                    <p className="text-purple-400 text-xs">Gemstone</p>
                    <p className="text-white text-sm">{p.remedies.gemstone}</p>
                  </div>
                  <div className="p-3 bg-purple-800/40 rounded-lg">
                    <p className="text-purple-400 text-xs">Lucky Colors</p>
                    <p className="text-white text-sm">{p.remedies.color}</p>
                  </div>
                  <div className="p-3 bg-purple-800/40 rounded-lg">
                    <p className="text-purple-400 text-xs">Favorable Day</p>
                    <p className="text-white text-sm">{p.remedies.day}</p>
                  </div>
                  <div className="p-3 bg-purple-800/40 rounded-lg">
                    <p className="text-purple-400 text-xs">Fasting Day</p>
                    <p className="text-white text-sm">{p.remedies.fasting}</p>
                  </div>
                </div>
                <div className="p-3 bg-green-600/20 rounded-lg mb-4">
                  <p className="text-green-300 text-xs font-medium mb-1">Charity Recommendations</p>
                  <p className="text-green-100 text-sm">{p.remedies.charity}</p>
                </div>
                <p className="text-purple-300 text-xs font-medium mb-2">Daily Tips for Success</p>
                <BulletList items={p.remedies.tips} />
              </Section>
            )}
          </div>
        )}

        {/* Legacy format support */}
        {!p.summary && p.past && (
          <div className="space-y-4">
            <Section title="Past Influences" icon={<Clock className="w-5 h-5" />}>
              <p className="text-purple-100 text-sm whitespace-pre-line">{p.past}</p>
            </Section>
            <Section title="Present Situation" icon={<Zap className="w-5 h-5" />}>
              <p className="text-purple-100 text-sm whitespace-pre-line">{p.present}</p>
            </Section>
            <Section title="Future Path" icon={<TrendingUp className="w-5 h-5" />}>
              <p className="text-purple-100 text-sm whitespace-pre-line">{p.future}</p>
            </Section>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-4 pt-4">
        <button
          onClick={onReset}
          className="flex-1 py-3 px-6 bg-purple-800/50 hover:bg-purple-700/50 text-white font-medium rounded-lg border border-purple-500/30 transition-all"
        >
          Get Another Reading
        </button>
        <button
          onClick={() => window.print()}
          className="py-3 px-6 bg-indigo-800/50 hover:bg-indigo-700/50 text-white font-medium rounded-lg border border-indigo-500/30 transition-all"
        >
          Print / Save
        </button>
      </div>
    </div>
  );
}
