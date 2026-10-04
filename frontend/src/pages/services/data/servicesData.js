export const CATEGORIES = [
  { id: 'wedding', label: 'WEDDING' },
  { id: 'pre-wedding', label: 'PRE-WEDDING' },
  { id: 'birthday', label: 'BIRTHDAY' },
  { id: 'portrait', label: 'PORTRAIT' },
  { id: 'event', label: 'EVENT' },
  { id: 'commercial', label: 'COMMERCIAL' },
];

// Obsolete static collections deprecated in favor of dynamic MongoDB services
export const COLLECTIONS = [];

export const ATELIER_STANDARDS = [
  {
    icon: 'dual-medium',
    title: 'Dual-Medium Mastery',
    description: 'Simultaneous digital raw capture and traditional grain film cameras on location.',
  },
  {
    icon: 'vault',
    title: 'Encrypted Private Vault',
    description: 'Permanent cloud preservation, 10-year archival security, and full lab resolution access.',
  },
  {
    icon: 'box',
    title: 'Museum Box Delivery',
    description: 'Complimentary white-glove hand delivery of your signed archival print folio box.',
  },
];

export const CREATIVE_DISCIPLINES = [
  {
    id: 'fine-art-photo',
    title: 'Fine-Art Photography',
    subtitle: 'Medium Format & 35mm',
    isIncluded: true,
    defaultChecked: true,
  },
  {
    id: 'cinematography',
    title: 'Cinematography (Super 8 / 4K)',
    subtitle: 'Editorial cinematic film master',
    isIncluded: false,
    defaultChecked: false,
  },
  {
    id: 'drone-aerial',
    title: 'Drone & Aerial Landscapes',
    subtitle: 'Atmospheric architectural vistas',
    isIncluded: false,
    defaultChecked: false,
  },
  {
    id: 'archival-album',
    title: 'Archival Fine-Art Album',
    subtitle: 'Handcrafted in Florence, Italy',
    isIncluded: true,
    defaultChecked: true,
  },
];

export const DURATION_OPTIONS = ['1 Day', '2 Days', '3+ Days'];

export const PROVENANCE_OPTIONS = [
  'Instagram',
  'Google Search',
  'Friend / Family',
  'Wedding Platform / Vogue',
  'Venue Concierge',
  'Other',
];

export const COUNTRY_CODES = [
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+1', country: 'US', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+39', country: 'IT', flag: '🇮🇹' },
  { code: '+971', country: 'AE', flag: '🇦🇪' },
  { code: '+61', country: 'AU', flag: '🇦🇺' },
  { code: '+65', country: 'SG', flag: '🇸🇬' },
  { code: '+41', country: 'CH', flag: '🇨🇭' },
];

export const COMPARISON_MATRIX_FEATURES = [
  {
    category: 'Coverage & Timeline',
    items: [
      { name: 'Timeline Coverage', essential: '8 Hours', signature: '12 Hours (1-2 Days)', luxury: 'Up to 3 Days (Residency)' },
      { name: 'Photographers', essential: '1 Principal + 1 Associate', signature: 'Creative Director + 2 Associates', luxury: 'Full Atelier Team' },
      { name: 'Pre-Wedding Session', essential: 'Optional add-on', signature: 'Optional add-on', luxury: 'Included (European location)' },
    ],
  },
  {
    category: 'Medium & Delivery',
    items: [
      { name: 'Analog Medium', essential: '35mm Film Rolls (Portra)', signature: '120 Medium Format + 35mm', luxury: 'Unlimited 120 & 35mm (Paris Lab)' },
      { name: 'Master Files', essential: '400+ Curated Files', signature: '750+ Fine Art Images', luxury: '1,200+ Monograph Images' },
      { name: 'Turnaround', essential: '5–6 Weeks Standard', signature: 'Priority 3-Week Delivery', luxury: 'Expedited 2-Week Rush' },
      { name: 'Cloud Vault', essential: '5-Year Archive', signature: '10-Year Archival Vault', luxury: 'Lifetime Storage & Raw Cloud' },
    ],
  },
  {
    category: 'Physical Heirlooms',
    items: [
      { name: 'Fine Art Album', essential: 'Optional upgrade', signature: '12x12 Italian Leather (30 Spreads)', luxury: '14x14 Heirloom + 2 Parent Books' },
      { name: 'Print Presentation', essential: 'Belgian Linen USB Box', signature: 'Museum Presentation Box', luxury: 'Handcrafted Walnut Presentation' },
      { name: 'Hand Delivery', essential: '—', signature: 'Included domestically', luxury: 'Complimentary Worldwide' },
    ],
  },
];
