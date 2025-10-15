// app/api/admin/assessments/bulk-delete/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function DELETE(request: Request) {
  try {
    const { ids } = await request.json();
    
    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Invalid request: ids array is required' },
        { status: 400 }
      );
    }

    // Delete assessments by IDs
    const result = await prisma.assessment.deleteMany({
      where: {
        id: {
          in: ids
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      deletedCount: result.count 
    });
  } catch (error) {
    console.error('Error deleting assessments:', error);
    return NextResponse.json(
      { error: 'Failed to delete assessments' },
      { status: 500 }
    );
  }
}