const fs = require('fs');

const dataPath = 'app/config/sections/games.json';
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

const minecraftPlans = [
  { id: "mc-1", name: "Starter", ram: "1GB", cpu: "50%", storage: "5GB", allocations: 2, databases: 1, backups: 1, price: 45, type: "budget", orderLink: "https://billing.hostlixo.com" },
  { id: "mc-2", name: "Basic", ram: "2GB", cpu: "100%", storage: "8GB", allocations: 2, databases: 2, backups: 1, price: 90, type: "budget", orderLink: "https://billing.hostlixo.com" },
  { id: "mc-3", name: "Standard", ram: "3GB", cpu: "120%", storage: "10GB", allocations: 2, databases: 3, backups: 2, price: 135, type: "budget", orderLink: "https://billing.hostlixo.com" },
  { id: "mc-4", name: "Advanced", ram: "4GB", cpu: "150%", storage: "15GB", allocations: 3, databases: 3, backups: 2, price: 180, type: "budget", orderLink: "https://billing.hostlixo.com" },
  { id: "mc-5", name: "Pro", ram: "6GB", cpu: "200%", storage: "20GB", allocations: 3, databases: 4, backups: 2, price: 240, type: "budget", orderLink: "https://billing.hostlixo.com" },
  { id: "mc-6", name: "Elite", ram: "8GB", cpu: "250%", storage: "25GB", allocations: 4, databases: 5, backups: 3, price: 360, type: "budget", orderLink: "https://billing.hostlixo.com" },
  { id: "mc-7", name: "Ultimate", ram: "12GB", cpu: "300%", storage: "35GB", allocations: 5, databases: 5, backups: 4, price: 560, type: "budget", orderLink: "https://billing.hostlixo.com" },
  { id: "mc-8", name: "Infinity", ram: "16GB", cpu: "450%", storage: "45GB", allocations: 6, databases: 6, backups: 5, price: 740, type: "budget", orderLink: "https://billing.hostlixo.com" }
];

const defaultPlans = [
  { id: "def-1", ram: "2GB", cpu: "100%", storage: "10GB", allocations: 1, databases: 1, backups: 1, price: 45, type: "budget", orderLink: "https://billing.hostlixo.com" },
  { id: "def-2", ram: "4GB", cpu: "150%", storage: "15GB", allocations: 2, databases: 2, backups: 1, price: 90, type: "budget", orderLink: "https://billing.hostlixo.com" },
  { id: "def-3", ram: "6GB", cpu: "200%", storage: "20GB", allocations: 2, databases: 3, backups: 1, price: 135, type: "budget", orderLink: "https://billing.hostlixo.com" },
  { id: "def-4", ram: "8GB", cpu: "250%", storage: "25GB", allocations: 3, databases: 4, backups: 2, price: 180, type: "budget", orderLink: "https://billing.hostlixo.com" },
  { id: "def-5", ram: "10GB", cpu: "300%", storage: "30GB", allocations: 3, databases: 5, backups: 2, price: 225, type: "budget", orderLink: "https://billing.hostlixo.com" },
  { id: "def-6", ram: "12GB", cpu: "350%", storage: "35GB", allocations: 4, databases: 6, backups: 2, price: 270, type: "budget", orderLink: "https://billing.hostlixo.com" },
  { id: "def-7", ram: "14GB", cpu: "400%", storage: "40GB", allocations: 4, databases: 7, backups: 2, price: 315, type: "budget", orderLink: "https://billing.hostlixo.com" },
  { id: "def-8", ram: "16GB", cpu: "450%", storage: "45GB", allocations: 5, databases: 8, backups: 3, price: 360, type: "budget", orderLink: "https://billing.hostlixo.com" },
  { id: "def-9", ram: "20GB", cpu: "500%", storage: "55GB", allocations: 6, databases: 10, backups: 3, price: 450, type: "budget", orderLink: "https://billing.hostlixo.com" },
  { id: "def-10", ram: "24GB", cpu: "600%", storage: "65GB", allocations: 7, databases: 12, backups: 4, price: 540, type: "budget", orderLink: "https://billing.hostlixo.com" },
  { id: "def-11", ram: "32GB", cpu: "800%", storage: "85GB", allocations: 10, databases: 15, backups: 5, price: 720, type: "budget", orderLink: "https://billing.hostlixo.com" }
];

const deluxePlans = defaultPlans.map(p => ({ ...p, price: p.price * 2, id: p.id.replace('def-', 'dlx-'), type: "premium" }));

const getGame = id => data.games.find(g => g.id === id);

getGame('minecraft').plans.budget = minecraftPlans;
getGame('minecraft').plans.premium = []; // No premium tier shown for minecraft

getGame('hytale').plans.budget = defaultPlans;
getGame('hytale').plans.premium = deluxePlans;

getGame('palworld').plans.budget = defaultPlans;
getGame('palworld').plans.premium = deluxePlans;

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2) + '\n', 'utf8');
console.log('Updated games.json successfully.');
