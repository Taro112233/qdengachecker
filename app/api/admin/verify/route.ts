// app/api/admin/verify/route.ts

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { code } = await request.json();
    
    // ใช้ environment variable สำหรับ access code
    const ADMIN_ACCESS_CODE = process.env.ADMIN_ACCESS_CODE || 'admin123';
    
    if (code === ADMIN_ACCESS_CODE) {
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json(
      { error: 'Invalid access code' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Error verifying access code:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}