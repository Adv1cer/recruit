import mysql from "mysql2/promise";

export async function POST(request) {
  try {
    // Destructure the JSON request payload
    const {
      name,
      date,
      salary,
      citizen_id,
      position,
      address_1,
      address_2,
      province_id,
      district_id,
      subdistrict_id,
      zip_code,
      start_date,
      end_date,
    } = await request.json();

    // Validate input data
    if (
      !name ||
      !date ||
      !salary ||
      !citizen_id ||
      !position ||
      !address_1 ||
      !address_2 ||
      !province_id ||
      !district_id ||
      !subdistrict_id ||
      !zip_code ||
      !start_date ||
      !end_date
    ) {
      return new Response(
        JSON.stringify({ error: "All fields are required" }),
        { status: 400 }
      );
    }

    // Connect to the database
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });

    // Insert query into the `application` table
    const query = `
      INSERT INTO application 
      (name, date, salary, citizen_id, position, address_1, address_2, province, district, subdistrict, zip_code, start_date, end_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await connection.execute(query, [
      name,
      date,
      salary,
      citizen_id,
      position,
      address_1,
      address_2,
      province_id,
      district_id,
      subdistrict_id,
      zip_code,
      start_date,
      end_date,
    ]);

    await connection.end();

    return new Response(
      JSON.stringify({ success: "Data submitted successfully!" }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error inserting data:", err);
    return new Response(
      JSON.stringify({ error: "Failed to insert data" }),
      { status: 500 }
    );
  }
}