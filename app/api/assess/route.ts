// app/api/assess/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { conditionLabels } from '@/constants/conditions';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (data.age === null || data.gender === null || data.priorExposure === null) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Convert gender to Thai
    const genderMap: Record<string, string> = {
      'male': 'ชาย',
      'female': 'หญิง',
      'unspecified': 'ไม่ระบุ'
    };

    // Convert condition IDs to Thai labels
    const conditionsInThai = (data.conditions || []).map((id: string) => 
      conditionLabels[id] || id
    );

    // Create assessment record in database
    const assessment = await prisma.assessment.create({
      data: {
        age: data.age,
        gender: genderMap[data.gender] || data.gender,
        priorExposure: data.priorExposure,
        conditions: conditionsInThai,
        recommendation: data.recommendation || '',
        reason: data.reason || ''
      },
    });

    return NextResponse.json({ 
      success: true, 
      id: assessment.id 
    }, { status: 201 });
  } catch (error) {
    console.error('Error saving assessment:', error);
    return NextResponse.json(
      { error: 'Failed to save assessment' },
      { status: 500 }
    );
  }
}