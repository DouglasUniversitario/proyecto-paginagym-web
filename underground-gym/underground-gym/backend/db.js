import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const dbSettings = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,           
    trustServerCertificate: true,
  },
};

let pool; 

export async function getConnection() {
  try {
    // Si ya hay una conexión abierta, la reutilizamos
    if (pool && pool.connected) {
      return pool;
    }

    pool = await sql.connect(dbSettings);
    console.log("✅ Conectado a SQL Server");
    return pool;
  } catch (error) {
    console.error("❌ Error de conexión:", error);
    // importante: lanzar el error para que el endpoint pueda mandar error 500
    throw error;
  }
}

// exportamos sql por si lo necesitamos en los routes
export { sql };
