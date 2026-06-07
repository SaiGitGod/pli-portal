import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS pli_requests (
        id TEXT PRIMARY KEY,
        vendor_code TEXT NOT NULL,
        vendor_name TEXT NOT NULL,
        plant TEXT NOT NULL,
        no_of_items INTEGER NOT NULL,
        request_date TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'Pending Submission',
        pli_name TEXT NOT NULL,
        customer TEXT NOT NULL,
        quarter TEXT NOT NULL,
        category TEXT NOT NULL,
        buyer_name TEXT NOT NULL,
        submitted_file_name TEXT,
        submitted_date TEXT,
        vendor_comment TEXT,
        rejected_by TEXT,
        rejection_comment TEXT,
        rejection_date TEXT,
        submitted_file_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS pli_items (
        id TEXT PRIMARY KEY,
        request_id TEXT NOT NULL REFERENCES pli_requests(id),
        plant TEXT NOT NULL,
        component_code TEXT NOT NULL,
        component_description TEXT NOT NULL,
        uom TEXT NOT NULL,
        effective_quarter TEXT NOT NULL,
        effective_rate DECIMAL(12,2) NOT NULL,
        status TEXT NOT NULL DEFAULT 'Pending Submission'
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS vendors (
        vendor_code TEXT PRIMARY KEY,
        vendor_name TEXT NOT NULL,
        email TEXT NOT NULL,
        contact_person TEXT NOT NULL
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS purchase_group_buyers (
        purchase_group TEXT PRIMARY KEY,
        category_name TEXT NOT NULL,
        buyer_email TEXT NOT NULL,
        buyer_name TEXT NOT NULL
      )
    `;

    // Insert default vendors if empty
    const existingVendors = await sql`SELECT COUNT(*) as count FROM vendors`;
    if (parseInt(existingVendors.rows[0].count) === 0) {
      await sql`INSERT INTO vendors (vendor_code, vendor_name, email, contact_person) VALUES ('VAR001', 'Abhishek Jain', 'Abhishek.Jain1@varroc.com', 'Abhishek Jain')`;
      await sql`INSERT INTO vendors (vendor_code, vendor_name, email, contact_person) VALUES ('VAR002', 'Sreedhar Viswas', 'Sreedhar.Viswas@varroc.com', 'Sreedhar Viswas')`;
    }

    // Insert default purchase group buyers if empty
    const existingBuyers = await sql`SELECT COUNT(*) as count FROM purchase_group_buyers`;
    if (parseInt(existingBuyers.rows[0].count) === 0) {
      await sql`INSERT INTO purchase_group_buyers (purchase_group, category_name, buyer_email, buyer_name) VALUES ('V10', 'V10 Category', 'SaiKrishna.Kodipaka@varroc.com', 'Sai Krishna Kodipaka')`;
      await sql`INSERT INTO purchase_group_buyers (purchase_group, category_name, buyer_email, buyer_name) VALUES ('Electrical', 'Electrical', 'SaiKrishna.Kodipaka@varroc.com', 'Sai Krishna Kodipaka')`;
      await sql`INSERT INTO purchase_group_buyers (purchase_group, category_name, buyer_email, buyer_name) VALUES ('Molding', 'Molding', 'SaiKrishna.Kodipaka@varroc.com', 'Sai Krishna Kodipaka')`;
      await sql`INSERT INTO purchase_group_buyers (purchase_group, category_name, buyer_email, buyer_name) VALUES ('SM&F', 'SM&F', 'SaiKrishna.Kodipaka@varroc.com', 'Sai Krishna Kodipaka')`;
    }

    return NextResponse.json({ success: true, message: 'Database tables created successfully!' });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
