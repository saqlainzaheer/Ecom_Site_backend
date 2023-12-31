import "dotenv/config";
import mysql from "mysql2";
import { PORT, USER, PASSWORD, DATABASE } from "./config/index.js";
import app from "./app.js";

export const dbConnection = mysql.createPool({
  user: USER,
  port: "3306",
  password: PASSWORD,
  database: DATABASE,
  waitForConnections: true,
});

const main = async () => {
  dbConnection.getConnection((err) => {
    if (err) {
      console.log("DB NOT CONNECTED");
    } else {
      console.log("DB CONNECTED");
    }
  });

  app.listen(PORT, () => console.log(`Server is Listining on PORT ${PORT}`));
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
