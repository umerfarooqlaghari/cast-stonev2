import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://cast-stone-api-production.up.railway.app';

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/WholesaleBuyers/locations`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Ensure fresh data
    });

    if (!response.ok) {
      throw new Error(`Backend API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching wholesale buyer locations:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch wholesale buyer locations',
        data: []
      },
      { status: 500 }
    );
  }
}
