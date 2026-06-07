import { NextResponse } from 'next/server';
import { getDashboardData } from '@/lib/database';

export async function GET() {
  const data = await getDashboardData();
  return NextResponse.json(data);
}

export const dynamic = 'force-dynamic';
