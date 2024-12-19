import mysql from "mysql2/promise";

export async function GET(request) {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });

    const [positions] = await connection.execute("SELECT position_id, position_name FROM position");
    await connection.end();

    return new Response(JSON.stringify(positions), { status: 200 });
  } catch (err) {
    console.error("Error fetching positions:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch positions" }), { status: 500 });
  }
}