export const users = [
  { id: 'buyer1', username: 'buyer@varroc.com', password: 'buyer123', role: 'buyer', name: 'Buyer' },
  { id: 'vendor1', username: 'vendor1@josts.com', password: 'vendor123', role: 'vendor', name: 'Rajesh Patel', vendorCode: 'CCJ0040', vendorName: 'JOSTS ENGINEERING COMPANY' },
  { id: 'vendor2', username: 'vendor2@shreeswami.com', password: 'vendor123', role: 'vendor', name: 'Amit Shah', vendorCode: 'CSS0905', vendorName: 'SHREE SWAMI ENTERPRISES' },
  { id: 'vendor3', username: 'vendor3@snwater.com', password: 'vendor123', role: 'vendor', name: 'Priya Mehta', vendorCode: 'CSS0904', vendorName: 'SN WATER SOLUTIONS' },
];

export const categories = ['Electrical', 'Molding', 'SM&F'];
export const plants = ['1900', '5100', '2100', '1003'];
export const customers = ['TATA', 'Birla', 'Mahindra'];
export const quarters = ['Q1FY2526', 'Q2FY2526', 'Q3FY2526', 'Q4FY2526'];

export const pliRequests = [
  {
    id: 'REQ-2026-02-19-022',
    vendorCode: 'CCJ0040',
    vendorName: 'JOSTS ENGINEERING COMPANY',
    plant: '5100',
    noOfItems: 4,
    requestDate: '2026-02-19',
    status: 'Pending Submission',
    pliName: 'TATA_Q3FY2526_BU_26_15',
    customer: 'TATA',
    quarter: 'Q3FY2526',
    category: 'Electrical',
    buyerName: 'Buyer',
    items: [
      { id: 'ITEM-001', plant: '5100', componentCode: 'B00019000001', componentDescription: 'ADHESIVE ANABOND-221 SI 001 600001', uom: 'KG', effectiveQuarter: 'Q3FY2526', effectiveRate: 3500.0, status: 'Pending Submission' },
      { id: 'ITEM-002', plant: '5100', componentCode: 'B00019000002', componentDescription: 'ADHESIVE ANABOND-221 SI 001 600002', uom: 'KG', effectiveQuarter: 'Q3FY2526', effectiveRate: 3000.0, status: 'Pending Submission' },
      { id: 'ITEM-003', plant: '5100', componentCode: 'B00019000003', componentDescription: 'CABLE HARNESS ASSY 12V MAIN', uom: 'NOS', effectiveQuarter: 'Q3FY2526', effectiveRate: 1250.0, status: 'Pending Submission' },
      { id: 'ITEM-004', plant: '5100', componentCode: 'B00019000004', componentDescription: 'CONNECTOR 6-PIN WATERPROOF', uom: 'NOS', effectiveQuarter: 'Q3FY2526', effectiveRate: 450.0, status: 'Pending Submission' },
    ],
  },
  {
    id: 'REQ-2026-02-19-023',
    vendorCode: 'CCJ0040',
    vendorName: 'JOSTS ENGINEERING COMPANY',
    plant: '1900',
    noOfItems: 4,
    requestDate: '2026-02-19',
    status: 'Submitted',
    pliName: 'TATA_Q3FY2526_BU_26_14',
    customer: 'TATA',
    quarter: 'Q3FY2526',
    category: 'Electrical',
    buyerName: 'Buyer',
    items: [
      { id: 'ITEM-005', plant: '1900', componentCode: 'B00019000005', componentDescription: 'RELAY MODULE 24V DC', uom: 'NOS', effectiveQuarter: 'Q3FY2526', effectiveRate: 890.0, status: 'Submitted' },
      { id: 'ITEM-006', plant: '1900', componentCode: 'B00019000006', componentDescription: 'FUSE HOLDER BLADE TYPE', uom: 'NOS', effectiveQuarter: 'Q3FY2526', effectiveRate: 125.0, status: 'Submitted' },
      { id: 'ITEM-007', plant: '1900', componentCode: 'B00019000007', componentDescription: 'TERMINAL BLOCK 12-WAY', uom: 'NOS', effectiveQuarter: 'Q3FY2526', effectiveRate: 340.0, status: 'Submitted' },
      { id: 'ITEM-008', plant: '1900', componentCode: 'B00019000008', componentDescription: 'WIRE LOOM CORRUGATED 10MM', uom: 'MTR', effectiveQuarter: 'Q3FY2526', effectiveRate: 45.0, status: 'Submitted' },
    ],
  },
  {
    id: 'REQ-2026-02-19-020',
    vendorCode: 'CCJ0040',
    vendorName: 'JOSTS ENGINEERING COMPANY',
    plant: '5100',
    noOfItems: 4,
    requestDate: '2026-02-19',
    status: 'Pending Submission',
    pliName: 'TATA_Q3FY2526_BU_26_13',
    customer: 'TATA',
    quarter: 'Q3FY2526',
    category: 'Molding',
    buyerName: 'Buyer',
    items: [
      { id: 'ITEM-009', plant: '5100', componentCode: 'M00019000001', componentDescription: 'HOUSING MOLD UPPER PART A', uom: 'NOS', effectiveQuarter: 'Q3FY2526', effectiveRate: 2800.0, status: 'Pending Submission' },
      { id: 'ITEM-010', plant: '5100', componentCode: 'M00019000002', componentDescription: 'HOUSING MOLD LOWER PART B', uom: 'NOS', effectiveQuarter: 'Q3FY2526', effectiveRate: 2650.0, status: 'Pending Submission' },
      { id: 'ITEM-011', plant: '5100', componentCode: 'M00019000003', componentDescription: 'GROMMET RUBBER SEAL 25MM', uom: 'NOS', effectiveQuarter: 'Q3FY2526', effectiveRate: 75.0, status: 'Pending Submission' },
      { id: 'ITEM-012', plant: '5100', componentCode: 'M00019000004', componentDescription: 'CLIP RETAINER PLASTIC TYPE C', uom: 'NOS', effectiveQuarter: 'Q3FY2526', effectiveRate: 32.0, status: 'Pending Submission' },
    ],
  },
  {
    id: 'REQ-2026-02-19-021',
    vendorCode: 'CCJ0040',
    vendorName: 'JOSTS ENGINEERING COMPANY',
    plant: '1900',
    noOfItems: 4,
    requestDate: '2026-02-19',
    status: 'Submitted',
    pliName: 'TATA_Q3FY2526_BU_26_12',
    customer: 'TATA',
    quarter: 'Q3FY2526',
    category: 'SM&F',
    buyerName: 'Buyer',
    items: [
      { id: 'ITEM-013', plant: '1900', componentCode: 'S00019000001', componentDescription: 'BRACKET MOUNTING STEEL 3MM', uom: 'NOS', effectiveQuarter: 'Q3FY2526', effectiveRate: 560.0, status: 'Submitted' },
      { id: 'ITEM-014', plant: '1900', componentCode: 'S00019000002', componentDescription: 'PLATE BASE MILD STEEL 5MM', uom: 'KG', effectiveQuarter: 'Q3FY2526', effectiveRate: 180.0, status: 'Submitted' },
      { id: 'ITEM-015', plant: '1900', componentCode: 'S00019000003', componentDescription: 'BOLT HEX M10X30 GR8.8', uom: 'NOS', effectiveQuarter: 'Q3FY2526', effectiveRate: 12.0, status: 'Submitted' },
      { id: 'ITEM-016', plant: '1900', componentCode: 'S00019000004', componentDescription: 'WASHER FLAT M10 SS304', uom: 'NOS', effectiveQuarter: 'Q3FY2526', effectiveRate: 5.0, status: 'Submitted' },
    ],
  },
  {
    id: 'REQ-2026-02-19-019',
    vendorCode: 'CCJ0040',
    vendorName: 'JOSTS ENGINEERING COMPANY',
    plant: '1900',
    noOfItems: 8,
    requestDate: '2026-02-18',
    status: 'Closed',
    pliName: 'TATA_Q3FY2526_BU_26_11',
    customer: 'TATA',
    quarter: 'Q3FY2526',
    category: 'Electrical',
    buyerName: 'Buyer',
    items: [
      { id: 'ITEM-017', plant: '1900', componentCode: 'B00019000009', componentDescription: 'SWITCH TOGGLE DPDT 15A', uom: 'NOS', effectiveQuarter: 'Q3FY2526', effectiveRate: 275.0, status: 'Closed' },
      { id: 'ITEM-018', plant: '1900', componentCode: 'B00019000010', componentDescription: 'LED INDICATOR PANEL 12V RED', uom: 'NOS', effectiveQuarter: 'Q3FY2526', effectiveRate: 95.0, status: 'Closed' },
    ],
  },
  {
    id: 'REQ-2026-02-18-018',
    vendorCode: 'CCJ0040',
    vendorName: 'JOSTS ENGINEERING COMPANY',
    plant: '1900',
    noOfItems: 8,
    requestDate: '2026-02-18',
    status: 'Submitted',
    pliName: 'TATA_Q3FY2526_BU_26_10',
    customer: 'TATA',
    quarter: 'Q3FY2526',
    category: 'SM&F',
    buyerName: 'Buyer',
    items: [
      { id: 'ITEM-019', plant: '1900', componentCode: 'S00019000005', componentDescription: 'ANGLE IRON L50X50X5', uom: 'KG', effectiveQuarter: 'Q3FY2526', effectiveRate: 85.0, status: 'Submitted' },
      { id: 'ITEM-020', plant: '1900', componentCode: 'S00019000006', componentDescription: 'PIPE ROUND MS 25MM DIA', uom: 'MTR', effectiveQuarter: 'Q3FY2526', effectiveRate: 210.0, status: 'Submitted' },
    ],
  },
  {
    id: 'REQ-2026-02-18-017',
    vendorCode: 'CCJ0040',
    vendorName: 'JOSTS ENGINEERING COMPANY',
    plant: '1900',
    noOfItems: 8,
    requestDate: '2026-02-18',
    status: 'Pending Submission',
    pliName: 'TATA_Q2FY2526_BU_26_9',
    customer: 'TATA',
    quarter: 'Q2FY2526',
    category: 'Molding',
    buyerName: 'Buyer',
    items: [
      { id: 'ITEM-021', plant: '1900', componentCode: 'M00019000005', componentDescription: 'COVER CAP INJECTION MOLD', uom: 'NOS', effectiveQuarter: 'Q2FY2526', effectiveRate: 420.0, status: 'Pending Submission' },
      { id: 'ITEM-022', plant: '1900', componentCode: 'M00019000006', componentDescription: 'SEAL RING SILICONE 30MM', uom: 'NOS', effectiveQuarter: 'Q2FY2526', effectiveRate: 65.0, status: 'Pending Submission' },
    ],
  },
  {
    id: 'REQ-2026-02-18-016',
    vendorCode: 'CSS0905',
    vendorName: 'SHREE SWAMI ENTERPRISES',
    plant: '1900',
    noOfItems: 4,
    requestDate: '2026-02-18',
    status: 'Cancelled',
    pliName: 'TATA_Q2FY2526_BU_26_8',
    customer: 'TATA',
    quarter: 'Q2FY2526',
    category: 'SM&F',
    buyerName: 'Buyer',
    items: [
      { id: 'ITEM-023', plant: '1900', componentCode: 'S00019000007', componentDescription: 'HINGE HEAVY DUTY 100MM', uom: 'NOS', effectiveQuarter: 'Q2FY2526', effectiveRate: 320.0, status: 'Cancelled' },
      { id: 'ITEM-024', plant: '1900', componentCode: 'S00019000008', componentDescription: 'LATCH TOGGLE CLAMP GH201', uom: 'NOS', effectiveQuarter: 'Q2FY2526', effectiveRate: 450.0, status: 'Cancelled' },
    ],
  },
  {
    id: 'REQ-2026-02-18-015',
    vendorCode: 'CSS0904',
    vendorName: 'SN WATER SOLUTIONS',
    plant: '1900',
    noOfItems: 4,
    requestDate: '2026-02-18',
    status: 'Cancelled',
    pliName: 'TATA_Q2FY2526_BU_26_7',
    customer: 'TATA',
    quarter: 'Q2FY2526',
    category: 'Electrical',
    buyerName: 'Buyer',
    items: [
      { id: 'ITEM-025', plant: '1900', componentCode: 'B00019000011', componentDescription: 'PUMP MOTOR 0.5HP SUBMERSIBLE', uom: 'NOS', effectiveQuarter: 'Q2FY2526', effectiveRate: 8500.0, status: 'Cancelled' },
      { id: 'ITEM-026', plant: '1900', componentCode: 'B00019000012', componentDescription: 'FLOAT SWITCH LEVEL SENSOR', uom: 'NOS', effectiveQuarter: 'Q2FY2526', effectiveRate: 650.0, status: 'Cancelled' },
    ],
  },
  {
    id: 'REQ-2026-02-18-014',
    vendorCode: 'CSS0905',
    vendorName: 'SHREE SWAMI ENTERPRISES',
    plant: '1900',
    noOfItems: 4,
    requestDate: '2026-02-13',
    status: 'Pending Submission',
    pliName: 'Birla_Q2FY2526_BU_25_135',
    customer: 'Birla',
    quarter: 'Q2FY2526',
    category: 'SM&F',
    buyerName: 'Buyer',
    items: [
      { id: 'ITEM-027', plant: '1900', componentCode: 'S00019000009', componentDescription: 'SHAFT DRIVE STEEL EN8 25MM', uom: 'NOS', effectiveQuarter: 'Q2FY2526', effectiveRate: 1800.0, status: 'Pending Submission' },
      { id: 'ITEM-028', plant: '1900', componentCode: 'S00019000010', componentDescription: 'COUPLING RIGID FLANGE 25MM', uom: 'NOS', effectiveQuarter: 'Q2FY2526', effectiveRate: 950.0, status: 'Pending Submission' },
    ],
  },
];

export const pliNames = [
  { name: 'TATA_Q3FY2526_BU_26_15', totalParts: 8, approved: 0, cancelled: 0, pending: 8, startDate: '2026-02-19' },
  { name: 'TATA_Q3FY2526_BU_26_14', totalParts: 8, approved: 0, cancelled: 0, pending: 8, startDate: '2026-02-19' },
  { name: 'TATA_Q3FY2526_BU_26_13', totalParts: 8, approved: 0, cancelled: 0, pending: 8, startDate: '2026-02-19' },
  { name: 'TATA_Q3FY2526_BU_26_12', totalParts: 8, approved: 0, cancelled: 0, pending: 8, startDate: '2026-02-19' },
  { name: 'TATA_Q3FY2526_BU_26_11', totalParts: 8, approved: 8, cancelled: 0, pending: 0, startDate: '2026-02-18' },
  { name: 'TATA_Q3FY2526_BU_26_10', totalParts: 8, approved: 0, cancelled: 0, pending: 8, startDate: '2026-02-18' },
  { name: 'TATA_Q2FY2526_BU_26_9', totalParts: 8, approved: 0, cancelled: 0, pending: 8, startDate: '2026-02-18' },
  { name: 'TATA_Q2FY2526_BU_26_8', totalParts: 4, approved: 0, cancelled: 4, pending: 0, startDate: '2026-02-18' },
  { name: 'TATA_Q2FY2526_BU_26_7', totalParts: 4, approved: 0, cancelled: 4, pending: 0, startDate: '2026-02-18' },
  { name: 'Birla_Q2FY2526_BU_25_135', totalParts: 4, approved: 0, cancelled: 0, pending: 4, startDate: '2026-02-13' },
];

export const vendorSummary = [
  { vendorCode: 'CCJ0040', totalParts: 64, approved: 8, cancelled: 0, pending: 56 },
  { vendorCode: 'CSS0904', totalParts: 30, approved: 0, cancelled: 8, pending: 22 },
  { vendorCode: 'CSS0905', totalParts: 26, approved: 0, cancelled: 4, pending: 22 },
];

export function getDashboardSummary(requests = pliRequests) {
  const totalPLI = new Set(requests.map(r => r.pliName)).size;
  const totalBOCodes = requests.reduce((sum, r) => sum + r.noOfItems, 0);
  const avgDaysClosure = 31;
  const pendingSubmissions = requests.filter(r => r.status === 'Pending Submission' || r.status === 'Rejected').reduce((sum, r) => sum + r.noOfItems, 0);
  const activePLI = new Set(requests.filter(r => r.status !== 'Closed' && r.status !== 'Cancelled').map(r => r.pliName)).size;
  return { totalPLI, totalBOCodes, avgDaysClosure, pendingSubmissions, activePLI };
}

export function getPLIStatusOverview(requests = pliRequests) {
  const pliMap = {};
  requests.forEach(r => {
    if (!pliMap[r.pliName]) pliMap[r.pliName] = [];
    pliMap[r.pliName].push(r.status);
  });
  let approved = 0, pending = 0, cancelled = 0;
  Object.values(pliMap).forEach(statuses => {
    const hasPending = statuses.some(s => s === 'Pending Submission' || s === 'Submitted' || s === 'Rejected');
    const allCancelled = statuses.every(s => s === 'Cancelled');
    const hasApproved = statuses.some(s => s === 'Closed');
    if (hasPending) pending++;
    else if (allCancelled) cancelled++;
    else if (hasApproved) approved++;
  });
  return [
    { name: 'Approved', value: approved, color: '#22c55e' },
    { name: 'Pending', value: pending, color: '#eab308' },
    { name: 'Cancelled', value: cancelled, color: '#ef4444' },
  ];
}

export function getCategorySummary(requests = pliRequests) {
  const catMap = {};
  requests.forEach(r => {
    if (!catMap[r.category]) catMap[r.category] = { approved: 0, pending: 0, cancelled: 0 };
    if (r.status === 'Closed') catMap[r.category].approved += r.noOfItems;
    else if (r.status === 'Cancelled') catMap[r.category].cancelled += r.noOfItems;
    else catMap[r.category].pending += r.noOfItems;
  });
  return Object.entries(catMap).map(([name, data]) => ({ name, Approved: data.approved, Pending: data.pending, Cancelled: data.cancelled }));
}
