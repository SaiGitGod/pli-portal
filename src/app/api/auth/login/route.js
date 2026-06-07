import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';
import { signToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { username, password, role } = await request.json();

    const { rows } = await sql`
      SELECT * FROM users WHERE username = ${username} AND password = ${password} AND role = ${role}
    `;

    if (rows.length === 0) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const user = rows[0];

    // Extract display name from email
    const emailPrefix = username.split('@')[0];
    const displayName = emailPrefix
      .split(/[._-]/)
      .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
      .join(' ');

    const tokenPayload = {
      id: user.id,
      role: user.role,
      name: displayName,
      ...(user.vendor_code && { vendorCode: user.vendor_code, vendorName: user.vendor_name })
    };

    const token = signToken(tokenPayload);
    return NextResponse.json({ token, user: tokenPayload });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
