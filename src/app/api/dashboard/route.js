import mysql from "mysql2/promise";

export async function GET(request) {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });

    const query = `
      SELECT a.application_id, a.name, a.date, a.start_date, a.end_date, a.salary, a.citizen_id, a.position, a.address_1, a.address_2, p.name_in_thai AS province, d.name_in_thai AS district, s.name_in_thai AS subdistrict, a.zip_code
      FROM application a
      JOIN provinces p ON a.province = p.id
      JOIN districts d ON a.district = d.id
      JOIN subdistricts s ON a.subdistrict = s.id
    `;
    const [rows] = await connection.execute(query);
    await connection.end();

    return new Response(JSON.stringify(rows), { status: 200 });
  } catch (err) {
    console.error("Error fetching data:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch data" }), { status: 500 });
  }
}