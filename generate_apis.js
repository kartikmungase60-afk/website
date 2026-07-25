const fs = require('fs');
const path = require('path');

const apiMap = [
  { path: 'services', model: 'Service' },
  { path: 'plan-types', model: 'PlanType' },
  { path: 'categories', model: 'Category' },
  { path: 'plans', model: 'Plan' },
  { path: 'locations', model: 'Location' }
];

for (const api of apiMap) {
  const dir = path.join(process.cwd(), 'app', 'api', 'admin', api.path);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  let extraIncludes = '';
  let populate = '';
  if (api.model === 'Plan') populate = '.populate("categoryId").populate("locations")';
  else if (api.model === 'Category') populate = '.populate("planTypeId")';
  else if (api.model === 'PlanType') populate = '.populate("serviceId")';

  const content = `import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongoose';
import ${api.model} from '@/app/lib/models/${api.model}';
import { requireAdmin } from '@/app/api/admin/auth-utils';

export async function GET() {
  const user = await requireAdmin();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  try {
    const data = await ${api.model}.find()${populate}.sort({ createdAt: 1 });
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
    const data = await ${api.model}.create(body);
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
    
    const data = await ${api.model}.findByIdAndUpdate(_id, updateData, { new: true, runValidators: true });
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
    
    await ${api.model}.findByIdAndDelete(_id);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
`;
  fs.writeFileSync(path.join(dir, 'route.ts'), content);
}
console.log('APIs generated successfully.');
