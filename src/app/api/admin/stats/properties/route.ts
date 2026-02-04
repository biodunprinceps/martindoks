import { NextResponse } from 'next/server';
import { getAllProperties } from '@/lib/property-storage';
import { properties as staticProperties } from '@/data/properties';

export async function GET() {
  try {
    let props;
    try {
      props = await getAllProperties();
      if (props.length === 0) {
        props = staticProperties;
      }
    } catch {
      props = staticProperties;
    }
    
    return NextResponse.json({
      count: props.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load property stats' },
      { status: 500 }
    );
  }
}

