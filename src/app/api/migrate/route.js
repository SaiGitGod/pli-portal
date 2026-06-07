import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  const results = [];
  try {
    await sql`ALTER TABLE pli_requests ADD COLUMN IF NOT EXISTS submitted_file_url TEXT`;
    results.push('Added submitted_file_url column');
  } catch (e) { results.push('submitted_file_url: ' + e.message); }

  try {
    await sql`ALTER TABLE pli_requests ADD COLUMN IF NOT EXISTS submitted_file_name TEXT`;
    results.push('Checked submitted_file_name column');
  } catch (e) { results.push('submitted_file_name: ' + e.message); }

  try {
    await sql`ALTER TABLE pli_requests ADD COLUMN IF NOT EXISTS submitted_date TEXT`;
    results.push('Checked submitted_date column');
  } catch (e) { results.push('submitted_date: ' + e.message); }

  try {
    await sql`ALTER TABLE pli_requests ADD COLUMN IF NOT EXISTS vendor_comment TEXT`;
    results.push('Checked vendor_comment column');
  } catch (e) { results.push('vendor_comment: ' + e.message); }

  try {
    await sql`ALTER TABLE pli_requests ADD COLUMN IF NOT EXISTS rejected_by TEXT`;
    results.push('Checked rejected_by column');
  } catch (e) { results.push('rejected_by: ' + e.message); }

  try {
    await sql`ALTER TABLE pli_requests ADD COLUMN IF NOT EXISTS rejection_comment TEXT`;
    results.push('Checked rejection_comment column');
  } catch (e) { results.push('rejection_comment: ' + e.message); }

  try {
    await sql`ALTER TABLE pli_requests ADD COLUMN IF NOT EXISTS rejection_date TEXT`;
    results.push('Checked rejection_date column');
  } catch (e) { results.push('rejection_date: ' + e.message); }

  return NextResponse.json({ success: true, results });
}
