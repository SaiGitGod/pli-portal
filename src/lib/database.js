// ==================== USER MANAGEMENT ====================

export async function getUserByCredentials(username, password, role) {
  const { rows } = await sql`SELECT * FROM users WHERE username = ${username} AND password = ${password} AND role = ${role}`;
  if (rows.length === 0) return null;
  const u = rows[0];
  return { id: u.id, username: u.username, role: u.role, name: u.name, vendorCode: u.vendor_code, vendorName: u.vendor_name };
}

export async function getAllUsers() {
  const { rows } = await sql`SELECT id, username, role, name, vendor_code, vendor_name FROM users ORDER BY role, name`;
  return rows.map(u => ({ id: u.id, username: u.username, role: u.role, name: u.name, vendorCode: u.vendor_code, vendorName: u.vendor_name }));
}

export async function addUser(id, username, password, role, name, vendorCode, vendorName) {
  await sql`INSERT INTO users (id, username, password, role, name, vendor_code, vendor_name) VALUES (${id}, ${username}, ${password}, ${role}, ${name}, ${vendorCode || null}, ${vendorName || null})`;
  return { id, username, role, name, vendorCode, vendorName };
}

export async function deleteUser(id) {
  await sql`DELETE FROM users WHERE id = ${id}`;
  return { success: true };
}
