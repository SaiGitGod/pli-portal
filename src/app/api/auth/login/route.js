import { NextResponse } from 'next/server';
import { users } from '@/data/mockData';
import { signToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { username, password, role } = await request.json();

    const user = users.find(
      (u) => u.username === username && u.password === password && u.role === role
    );

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const tokenPayload = {
      id: user.id,
      role: user.role,
      name: user.name,
      ...(user.vendorCode && { vendorCode: user.vendorCode, vendorName: user.vendorName }),
    };

    const token = signToken(tokenPayload);

    return NextResponse.json({ token, user: tokenPayload });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
