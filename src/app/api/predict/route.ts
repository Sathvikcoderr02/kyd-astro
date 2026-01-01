import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Prediction from '@/models/Prediction';
import { NAKSHATRAS, RASHIS, calculateVedicChart } from '@/lib/vedic-astrology';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// Get Nakshatra and Rashi details
function getNakshatraDetails(nakshatraName: string) {
  const name = nakshatraName.split(' - ')[0].trim();
  return NAKSHATRAS.find(n => n.name === name) || NAKSHATRAS[0];
}

function getRashiDetails(rashiName: string) {
  const name = rashiName.split(' (')[0].trim();
  return RASHIS.find(r => r.name === name) || RASHIS[0];
}

interface ChartData {
  lagna?: {
    name: string;
    english: string;
    lord: string;
    fullName: string;
  };
  dasha?: {
    ageInYears: number;
    mahadasha: {
      planet: string;
      planetEnglish: string;
      remainingYears: number;
    };
    antardasha: {
      planet: string;
      planetEnglish: string;
    };
    upcomingDashas: Array<{
      planet: string;
      ageRange: string;
      isCurrent: boolean;
    }>;
  };
}

async function generatePrediction(
  name: string,
  dob: string,
  rashi: string,
  birthStar: string,
  timeOfBirth?: string,
  placeOfBirth?: string
) {
  const nakshatraInfo = getNakshatraDetails(birthStar);
  const rashiInfo = getRashiDetails(rashi);

  // Calculate full chart if time is provided
  let chartData: ChartData = {};
  let hasTime = false;

  if (timeOfBirth) {
    try {
      const chart = calculateVedicChart(dob, timeOfBirth, placeOfBirth || 'Hyderabad');
      chartData = {
        lagna: chart.lagna,
        dasha: chart.dasha,
      };
      hasTime = true;
    } catch (error) {
      console.error('Chart calculation error:', error);
    }
  }

  // Build prompt based on available data
  let birthDetailsSection = `
PERSON'S BIRTH DETAILS:
- Name: ${name}
- Date of Birth: ${dob}
- Chandra Rashi (Moon Sign): ${rashi}
- Rashi Lord: ${rashiInfo.lord}
- Janma Nakshatra (Birth Star): ${birthStar}
- Nakshatra Lord: ${nakshatraInfo.lord}
- Nakshatra Deity: ${nakshatraInfo.deity}`;

  if (hasTime && chartData.lagna && chartData.dasha) {
    birthDetailsSection += `
- Time of Birth: ${timeOfBirth}
- Place of Birth: ${placeOfBirth || 'Hyderabad'}
- Lagna (Ascendant): ${chartData.lagna.fullName}
- Lagna Lord: ${chartData.lagna.lord}
- Current Age: ${chartData.dasha.ageInYears} years
- Current Mahadasha: ${chartData.dasha.mahadasha.planet} (${chartData.dasha.mahadasha.planetEnglish}) - ${chartData.dasha.mahadasha.remainingYears} years remaining
- Current Antardasha: ${chartData.dasha.antardasha.planet} (${chartData.dasha.antardasha.planetEnglish})`;
  }

  const dashaSection = hasTime && chartData.dasha ? `
DASHA PERIODS (Very Important for Timing):
Current running period: ${chartData.dasha.mahadasha.planet} Mahadasha with ${chartData.dasha.antardasha.planet} Antardasha.
This ${chartData.dasha.mahadasha.planet} period will influence career, relationships, and life events.
Use this to make timing predictions specific and accurate.` : `
NOTE: Birth time was not provided, so Lagna and exact Dasha periods cannot be calculated.
Predictions about timing (marriage age, career rise) will be based on general Rashi-Nakshatra patterns.`;

  const prompt = `You are an expert Vedic/Hindu astrologer (Jyotish Shastra specialist). Generate a detailed, easy-to-understand Jathakam reading.

${birthDetailsSection}
${dashaSection}

Generate a comprehensive Jathakam reading in the following JSON format. Write in simple, understandable language mixing English with Telugu/Sanskrit terms where appropriate. Be specific to their exact Rashi and Nakshatra combination.

{
  "summary": {
    "headline": "A one-line powerful summary of their life path",
    "traits": ["trait1", "trait2", "trait3", "trait4", "trait5"]
  },
  "personality": {
    "title": "Core Personality - ${rashiInfo.name} Rashi",
    "points": [
      "Detailed personality point 1 based on their Rashi",
      "Detailed personality point 2",
      "Detailed personality point 3",
      "Detailed personality point 4",
      "Detailed personality point 5"
    ],
    "insight": "A key insight about their nature"
  },
  "nakshatra": {
    "title": "${nakshatraInfo.name} Nakshatra Characteristics",
    "deity": "${nakshatraInfo.deity}",
    "lord": "${nakshatraInfo.lord}",
    "points": [
      "Nakshatra-specific trait 1",
      "Nakshatra-specific trait 2",
      "Nakshatra-specific trait 3",
      "Nakshatra-specific trait 4",
      "Nakshatra-specific trait 5"
    ],
    "insight": "Key insight about their Nakshatra influence"
  },
  "lagna": {
    "title": "Lagna (Ascendant) Influence",
    "sign": "${hasTime && chartData.lagna ? chartData.lagna.name : 'Unknown - Time not provided'}",
    "points": [
      "How Lagna affects their physical appearance",
      "How Lagna affects their approach to life",
      "Key Lagna-based trait"
    ],
    "insight": "${hasTime ? 'Lagna-specific insight' : 'Provide birth time for accurate Lagna reading'}"
  },
  "currentDasha": {
    "title": "Current Planetary Period (Dasha)",
    "mahadasha": "${hasTime && chartData.dasha ? chartData.dasha.mahadasha.planet : 'Unknown'}",
    "antardasha": "${hasTime && chartData.dasha ? chartData.dasha.antardasha.planet : 'Unknown'}",
    "effects": [
      "Current period effect 1",
      "Current period effect 2",
      "Current period effect 3"
    ],
    "advice": "Advice for navigating current period"
  },
  "mental": {
    "title": "Mental Nature & Thinking Style",
    "points": [
      "Mental trait 1",
      "Mental trait 2",
      "Mental trait 3",
      "Mental trait 4",
      "Mental trait 5"
    ]
  },
  "career": {
    "title": "Career & Professional Life",
    "bestFields": ["field1", "field2", "field3", "field4", "field5"],
    "strengths": ["work strength 1", "work strength 2", "work strength 3"],
    "advice": "Career advice specific to their combination"
  },
  "wealth": {
    "title": "Money & Financial Success",
    "points": [
      "Financial tendency 1",
      "Financial tendency 2",
      "Financial tendency 3"
    ],
    "insight": "Key insight about their wealth path"
  },
  "relationships": {
    "title": "Love & Relationships",
    "points": [
      "Relationship trait 1",
      "Relationship trait 2",
      "Relationship trait 3",
      "Relationship trait 4"
    ],
    "idealPartner": "Description of ideal partner traits"
  },
  "health": {
    "title": "Health & Wellness",
    "strengths": ["health strength 1", "health strength 2"],
    "cautions": ["area to watch 1", "area to watch 2"],
    "advice": "Health advice"
  },
  "challenges": {
    "title": "Life Challenges to Overcome",
    "points": [
      "Challenge 1",
      "Challenge 2",
      "Challenge 3",
      "Challenge 4"
    ],
    "remedy": "How these challenges reduce over time"
  },
  "lifePath": {
    "title": "Life Journey Overview",
    "earlyLife": "Description of early life (0-25 years)",
    "midLife": "Description of mid life (25-50 years)",
    "laterLife": "Description of later life (50+ years)",
    "peakYears": "Ages when success peaks"
  },
  "spirituality": {
    "title": "Spiritual Inclinations",
    "points": [
      "Spiritual tendency 1",
      "Spiritual tendency 2"
    ],
    "deity": "Recommended deity for worship",
    "mantra": "Beneficial mantra"
  },
  "remedies": {
    "title": "Remedies & Recommendations",
    "gemstone": "Recommended gemstone with reason",
    "color": "Lucky colors",
    "day": "Favorable day of week",
    "fasting": "Recommended fasting day if any",
    "charity": "Recommended charitable activities",
    "tips": ["daily tip 1", "daily tip 2", "daily tip 3"]
  },
  "timing": {
    "title": "Important Life Timing",
    "careerRise": "${hasTime ? 'Specific age range based on Dasha' : 'General age range based on Rashi-Nakshatra'}",
    "marriage": "${hasTime ? 'Specific age based on 7th house and Dasha' : 'General favorable age'}",
    "saturnMaturity": "When Saturn matures (age 36 effects)",
    "luckyYears": ["year1", "year2", "year3"]
  }
}

IMPORTANT GUIDELINES:
1. Be specific to ${nakshatraInfo.name} Nakshatra and ${rashiInfo.name} Rashi combination
2. ${hasTime ? `Consider Lagna ${chartData.lagna?.name} and current ${chartData.dasha?.mahadasha.planet} Dasha for timing predictions` : 'Since birth time is not provided, make timing predictions general'}
3. Use simple, understandable language
4. Mix Telugu/Sanskrit terms naturally (like Graha, Dasha, Dosha, Shani, Guru, etc.)
5. Be encouraging but realistic
6. Include specific details, not generic statements
7. Consider the Nakshatra lord ${nakshatraInfo.lord} and Rashi lord ${rashiInfo.lord} influences
8. ${hasTime ? `Current age is ${chartData.dasha?.ageInYears}, make predictions relevant to their life stage` : 'Make age-based predictions general'}
9. Make predictions relevant and practical`;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'http://localhost:3003',
      'X-Title': 'Vedic Jyotish App',
    },
    body: JSON.stringify({
      model: 'openai/gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`OpenRouter API error: ${error}`);
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  // Try to parse JSON from the response
  try {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const predictions = JSON.parse(jsonMatch[0]);
      // Add chart data to predictions
      if (hasTime) {
        predictions.chartData = {
          hasTime: true,
          lagna: chartData.lagna,
          dasha: chartData.dasha,
        };
      } else {
        predictions.chartData = {
          hasTime: false,
          message: 'Provide birth time for Lagna and Dasha details',
        };
      }
      return predictions;
    }
  } catch {
    console.error('Failed to parse prediction JSON');
  }

  // Fallback: basic structure
  return {
    summary: {
      headline: "Your life is guided by determination and inner strength",
      traits: ["Determined", "Intuitive", "Resilient", "Loyal", "Ambitious"]
    },
    personality: {
      title: `Core Personality - ${rashiInfo.name} Rashi`,
      points: [
        "Strong willpower and determination",
        "Deep emotional nature",
        "Natural leadership qualities",
        "Protective of loved ones",
        "Seeks truth and authenticity"
      ],
      insight: "You are destined for a meaningful life"
    },
    nakshatra: {
      title: `${nakshatraInfo.name} Nakshatra Characteristics`,
      deity: nakshatraInfo.deity,
      lord: nakshatraInfo.lord,
      points: [
        "Blessed by " + nakshatraInfo.deity,
        "Influenced by " + nakshatraInfo.lord,
        "Natural ability for success",
        "Strong karmic protection",
        "Destined for growth"
      ],
      insight: "Your Nakshatra brings unique blessings"
    },
    chartData: hasTime ? { hasTime: true, lagna: chartData.lagna, dasha: chartData.dasha } : { hasTime: false }
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, dateOfBirth, rashi, birthStar, timeOfBirth, placeOfBirth } = body;

    if (!name || !dateOfBirth || !rashi || !birthStar) {
      return NextResponse.json(
        { error: 'Name, date of birth, rashi, and birth star are required' },
        { status: 400 }
      );
    }

    // Generate predictions using OpenRouter
    const predictions = await generatePrediction(
      name,
      dateOfBirth,
      rashi,
      birthStar,
      timeOfBirth,
      placeOfBirth
    );

    // Connect to MongoDB and save
    await connectDB();

    const newPrediction = new Prediction({
      name,
      dateOfBirth: new Date(dateOfBirth),
      rashi,
      birthStar,
      predictions,
    });

    await newPrediction.save();

    return NextResponse.json({
      success: true,
      data: {
        id: newPrediction._id,
        name,
        dateOfBirth,
        rashi,
        birthStar,
        timeOfBirth: timeOfBirth || null,
        placeOfBirth: placeOfBirth || null,
        hasTime: !!timeOfBirth,
        predictions,
      },
    });
  } catch (error) {
    console.error('Prediction error:', error);
    return NextResponse.json(
      { error: 'Failed to generate prediction' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const predictions = await Prediction.find().sort({ createdAt: -1 }).limit(10);
    return NextResponse.json({ success: true, data: predictions });
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch predictions' },
      { status: 500 }
    );
  }
}
