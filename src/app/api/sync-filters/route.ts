import { db } from '@/firebase/admin';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Get all interviews
    const interviewsSnapshot = await db.collection('interviews').get();

    // Initialize sets to store unique values
    const uniqueTypes = new Set<string>();
    const uniqueTechStacks = new Set<string>();
    const uniqueLevels = new Set<string>();

    // Collect unique values from all interviews
    interviewsSnapshot.forEach((doc) => {
      const data = doc.data();
      uniqueTypes.add(data.type);
      data.techstack?.forEach((tech: string) => uniqueTechStacks.add(tech));
      uniqueLevels.add(data.level);
    });

    // Update the filters collection
    await db
      .collection('filters')
      .doc('options')
      .set({
        types: Array.from(uniqueTypes),
        techstacks: Array.from(uniqueTechStacks),
        levels: Array.from(uniqueLevels),
        lastUpdated: new Date().toISOString(),
        totalInterviews: interviewsSnapshot.size,
      });

    return NextResponse.json({
      success: true,
      message: 'Filters synchronized successfully',
      stats: {
        totalInterviews: interviewsSnapshot.size,
        uniqueTypes: uniqueTypes.size,
        uniqueTechStacks: uniqueTechStacks.size,
        uniqueLevels: uniqueLevels.size,
      },
    });
  } catch (error) {
    console.error('Error syncing filters:', error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
