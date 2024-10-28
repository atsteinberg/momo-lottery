import getUser from '@/utils/user';
import { NextRequest, NextResponse } from 'next/server';

export const GET = async (
  req: NextRequest,
  { params: { clerkId } }: { params: { clerkId: string } },
) => {
  const user = await getUser(clerkId);
  return NextResponse.json(user);
};
