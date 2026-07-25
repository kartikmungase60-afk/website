import dbConnect from './mongoose';
import Service from './models/Service';
import PlanType from './models/PlanType';
import Category from './models/Category';
import Plan from './models/Plan';
import Location from './models/Location';

export async function getServiceData(slug: string) {
  await dbConnect();
  
  const service = await Service.findOne({ slug }).lean();
  if (!service) return { service: null, planTypes: [], categories: [], plans: [], locations: [] };

  const planTypes = await PlanType.find({ serviceId: service._id }).lean();
  const categories = await Category.find({ planTypeId: { $in: planTypes.map(pt => pt._id) } }).lean();
  
  const plans = await Plan.find({ categoryId: { $in: categories.map(c => c._id) } })
    .populate('locations')
    .sort({ price: 1 })
    .lean();
    
  const locations = await Location.find().lean();

  return {
    service,
    planTypes: JSON.parse(JSON.stringify(planTypes)),
    categories: JSON.parse(JSON.stringify(categories)),
    plans: JSON.parse(JSON.stringify(plans)),
    locations: JSON.parse(JSON.stringify(locations)),
  };
}

export function transformDbDataForCatalog(dbData: any) {
  if (!dbData || !dbData.planTypes || !dbData.plans) return { planTypes: [], plans: {}, locations: [] };

  const planTypes = dbData.planTypes.map((pt: any) => ({
    id: pt.slug,
    name: pt.name,
    displayName: pt.name,
    image: pt.image || '/assets/hardware/nodejs-runtime.png',
    icon: pt.image || 'server',
  }));

  const plans: Record<string, any[]> = {};
  dbData.planTypes.forEach((pt: any) => {
    const categoriesForPt = dbData.categories.filter((c: any) => c.planTypeId === pt._id);
    const categoryIds = categoriesForPt.map((c: any) => c._id);
    
    plans[pt.slug] = dbData.plans
      .filter((p: any) => categoryIds.includes(p.categoryId))
      .map((p: any) => ({
        id: p.slug || p._id,
        name: p.name,
        ram: p.ram,
        ramDetail: p.ramDetail || 'RAM',
        cpu: p.cpu,
        cpuDetail: p.cpuDetail || 'Cores',
        storage: p.storage,
        storageDetail: p.storageDetail || 'NVMe',
        bandwidth: p.bandwidth,
        bandwidthDetail: p.bandwidthDetail || 'Transfer',
        price: p.price,
        period: p.period || '/mo',
        outOfStock: p.outOfStock,
        badge: p.badge || undefined,
        orderLink: p.orderLink || "https://billing.hostlixo.com"
      }));
  });

  const locations = (dbData.locations || []).map((loc: any) => ({
    id: loc.slug,
    name: loc.name,
    outOfStock: loc.outOfStock
  }));

  return { planTypes, plans, locations };
}
