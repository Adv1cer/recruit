import mysql from "mysql2/promise";

export async function GET(request) {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });

    const [subdistricts] = await connection.execute(
        "SELECT id, name_in_thai, district_id, zip_code FROM subdistricts"
      );
    const [districts] = await connection.execute(
      "SELECT id, name_in_thai, province_id FROM districts"
    );
    const [provinces] = await connection.execute(
      "SELECT id, name_in_thai FROM provinces"
    );

    await connection.end();

    return new Response(
      JSON.stringify({ subdistricts, districts, provinces }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching data:", err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch data" }),
      { status: 500 }
    );
  }
}
