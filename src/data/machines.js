import machinesData from './machines.json';

export function getMachinesByTechnology(tech) {
  return machinesData.filter(m => m.technology === tech);
}

export { machinesData };
