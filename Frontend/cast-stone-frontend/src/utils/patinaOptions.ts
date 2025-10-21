export interface PatinaOption {
  name: string;
  color: string;
  description?: string;
}

export const PATINA_OPTIONS: PatinaOption[] = [
  { name: 'Alpine Stone', color: '#D4C4A8', description: 'Light cream stone finish' },
  { name: 'Aged Stone', color: '#B8A082', description: 'Weathered natural stone' },
  { name: 'Charcoal', color: '#5A5A5A', description: 'Dark charcoal finish' },
  { name: 'Limestone', color: '#E6DCC6', description: 'Classic limestone color' },
  { name: 'Sandstone', color: '#C9B299', description: 'Warm sandstone tone' },
  { name: 'Slate Gray', color: '#708090', description: 'Cool slate gray' },
  { name: 'Terra Cotta', color: '#B87333', description: 'Earthy terra cotta' },
  { name: 'Antique White', color: '#F5F5DC', description: 'Soft antique white' },
  { name: 'Weathered Bronze', color: '#8B7355', description: 'Bronze patina finish' },
  { name: 'Natural Stone', color: '#A0A0A0', description: 'Natural stone gray' },
  { name: 'Moss Green', color: '#8FBC8F', description: 'Subtle moss green' },
  { name: 'Rust', color: '#B7410E', description: 'Oxidized rust finish' }
];

export const getPatinaColor = (patinaName: string): string | undefined => {
  const patina = PATINA_OPTIONS.find(p => p.name === patinaName);
  return patina?.color;
};

