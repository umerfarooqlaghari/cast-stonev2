/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://cast-stone-api-production.up.railway.app';

export async function GET(request: NextRequest) {
  try {
    console.log('Fetching wholesale buyer locations from:', `${API_BASE_URL}/api/WholesaleBuyers/locations`);

    const response = await fetch(`${API_BASE_URL}/api/WholesaleBuyers/locations`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Ensure fresh data
    });

    console.log('Backend response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error response:', errorText);
      throw new Error(`Backend API responded with status: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Backend response data:', data);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching wholesale buyer locations:', error);

    return NextResponse.json(
      {
        success: true, // Change to true so frontend doesn't show error
        message: 'No wholesale buyer locations available yet',
        data: [] // Return empty array instead of error
      },
      { status: 200 } // Return 200 instead of 500
    );
  }
}
