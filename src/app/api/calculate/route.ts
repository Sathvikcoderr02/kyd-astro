import { NextRequest, NextResponse } from 'next/server';
import { calculateVedicChart, calculatePossibleCharts } from '@/lib/vedic-astrology';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dateOfBirth, timeOfBirth, placeOfBirth } = body;

    if (!dateOfBirth) {
      return NextResponse.json(
        { error: 'Date of birth is required' },
        { status: 400 }
      );
    }

    // If time is provided, calculate exact chart
    if (timeOfBirth) {
      const chart = calculateVedicChart(dateOfBirth, timeOfBirth, placeOfBirth || 'Hyderabad');

      return NextResponse.json({
        success: true,
        isExact: true,
        hasTime: true,
        data: {
          rashi: chart.rashi.fullName,
          birthStar: chart.nakshatra.fullName,
          moonDegree: chart.moon.formattedSidereal,
          nakshatra: chart.nakshatra,
          rashiDetails: chart.rashi,
          lagna: chart.lagna,
          dasha: chart.dasha,
          ayanamsa: chart.ayanamsa,
          explanation: `Based on astronomical calculations using Lahiri Ayanamsa (${chart.ayanamsa.formatted}), the Moon was at ${chart.moon.formattedSidereal} in the sidereal zodiac at your birth time. This places the Moon in ${chart.rashi.name} Rashi at ${chart.rashi.formattedDegree}, and in ${chart.nakshatra.name} Nakshatra (Pada ${chart.nakshatra.pada}). Your Lagna (Ascendant) is ${chart.lagna.name}. Currently running ${chart.dasha.mahadasha.planet} Mahadasha - ${chart.dasha.antardasha.planet} Antardasha.`,
        },
      });
    }

    // If time is not provided, calculate all possibilities
    const possibilities = calculatePossibleCharts(dateOfBirth, placeOfBirth || 'Hyderabad');

    return NextResponse.json({
      success: true,
      isExact: false,
      hasTime: false,
      data: {
        possibleRashis: possibilities.possibleRashis,
        possibleNakshatras: possibilities.possibleNakshatras,
        timeWisePositions: possibilities.timeWisePositions,
        ayanamsa: possibilities.ayanamsa,
        message: possibilities.message,
        explanation: `Without exact birth time, we cannot determine the precise Nakshatra or Lagna. On ${dateOfBirth}, the Moon moved through ${possibilities.possibleNakshatras.length} Nakshatra(s): ${possibilities.possibleNakshatras.map(n => n.name).join(', ')}. Please provide your birth time for accurate Lagna, Dasha periods, and precise predictions.`,
        limitations: [
          'Cannot calculate Lagna (Ascendant) without time',
          'Cannot determine exact house placements',
          'Dasha periods may vary based on exact Nakshatra pada',
          'Marriage, career timing predictions will be approximate',
        ],
      },
    });
  } catch (error) {
    console.error('Calculation error:', error);
    return NextResponse.json(
      { error: 'Failed to calculate Rashi and Nakshatra' },
      { status: 500 }
    );
  }
}
