import { NextResponse } from 'next/server';
import {
  pliRequests, pliNames, vendorSummary,
  getDashboardSummary, getPLIStatusOverview, getCategorySummary,
} from '@/data/mockData';

export async function GET() {
  const summary = getDashboardSummary();
  const pliStatus = getPLIStatusOverview();
  const categorySummary = getCategorySummary();

  return NextResponse.json({
    summary,
    pliStatus,
    categorySummary,
    pliSummary: pliNames,
    vendorSummary,
  });
}
