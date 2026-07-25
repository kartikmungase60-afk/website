import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongoose';
import Plan from '@/app/lib/models/Plan';
import { requireAdmin } from '../auth-utils';

export async function GET() {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  try {
    const data = await Plan.find().populate("categoryId").populate("locations").sort({ createdAt: 1 });
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  try {
    const body = await req.json();
    const data = await Plan.create(body);
    return NextResponse.json({ data }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(req: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  try {
    const body = await req.json();
    const { _id, ...updateData } = body;
    if (!_id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    
    const data = await Plan.findByIdAndUpdate(_id, updateData, { new: true, runValidators: true });
    return NextResponse.json({ data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(req: Request) {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  try {
    const url = new URL(req.url);
    const _id = url.searchParams.get('id');
    if (!_id) return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    
    await Plan.findByIdAndDelete(_id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
