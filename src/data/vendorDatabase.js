// ============================================================
// VENDOR & BUYER MASTER DATABASE
// This maps vendor codes to their contact details
// and purchase groups to category buyer emails
//
// When moving to a real database (Vercel Postgres),
// these become database tables instead of arrays
// ============================================================

export const vendorMaster = [
  {
    vendorCode: 'VAR001',
    vendorName: 'Abhishek Jain',
    email: 'Abhishek.Jain1@varroc.com',
    contactPerson: 'Abhishek Jain'
  },
  {
    vendorCode: 'VAR002',
    vendorName: 'Sreedhar Viswas',
    email: 'Sreedhar.Viswas@varroc.com',
    contactPerson: 'Sreedhar Viswas'
  }
];

export const purchaseGroupBuyers = [
  {
    purchaseGroup: 'V10',
    categoryName: 'V10 Category',
    buyerEmail: 'SaiKrishna.Kodipaka@varroc.com',
    buyerName: 'Sai Krishna Kodipaka'
  },
  {
    purchaseGroup: 'Electrical',
    categoryName: 'Electrical',
    buyerEmail: 'SaiKrishna.Kodipaka@varroc.com',
    buyerName: 'Sai Krishna Kodipaka'
  },
  {
    purchaseGroup: 'Molding',
    categoryName: 'Molding',
    buyerEmail: 'SaiKrishna.Kodipaka@varroc.com',
    buyerName: 'Sai Krishna Kodipaka'
  },
  {
    purchaseGroup: 'SM&F',
    categoryName: 'SM&F',
    buyerEmail: 'SaiKrishna.Kodipaka@varroc.com',
    buyerName: 'Sai Krishna Kodipaka'
  }
];

// Default CC for all purchase groups not explicitly listed
export const defaultCCBuyer = {
  email: 'SaiKrishna.Kodipaka@varroc.com',
  name: 'Sai Krishna Kodipaka'
};

// Portal sender (your Gmail)
export const portalSender = {
  email: 'saikrishna.k333@gmail.com',
  name: 'VARROC PLI Portal'
};

// Helper: find vendor by code
export function getVendorByCode(code) {
  return vendorMaster.find(v => v.vendorCode === code) || null;
}

// Helper: find buyer by purchase group
export function getBuyerByPurchaseGroup(group) {
  return purchaseGroupBuyers.find(b => b.purchaseGroup === group) || {
    purchaseGroup: group,
    categoryName: group,
    buyerEmail: defaultCCBuyer.email,
    buyerName: defaultCCBuyer.name
  };
}
