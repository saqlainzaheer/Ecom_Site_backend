import { Router } from "express";
import { dbConnection } from "../index.js";
import { JWTSCECRETKEY } from "../config/app.js";
import { verifyToken } from "../middleware/index.js";
import jwt from "jsonwebtoken";
export const adminRouter = Router();
adminRouter.get("/admin", (req, res) => {
  const query = "SELECT * FROM admins";

  dbConnection.query(query, (error, results) => {
    if (error) {
      console.error("Error fetching data:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while fetching data." });
    }

    return res.status(200).json({ data: results });
  });
});

adminRouter.post("/admin", (req, res) => {
  const { name, email, password } = req.body;
  const query = "INSERT INTO admins (name, email,password) VALUES (?, ?,?)";

  dbConnection.query(query, [name, email, password], (error, results) => {
    if (error) {
      console.error("Error Creating Admin.", error);
      return res.status(500).json({ error: "Error Creating Admin.." });
    }

    return res.json({ message: "Admin created successfully." });
  });
});
adminRouter.post("/adminLogin", (req, res) => {
  const { email, password } = req.body;

  // Check the user's credentials against the database
  const query = "SELECT * FROM admins WHERE email = ? AND password = ?";
  dbConnection.query(query, [email, password], (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    // If authentication is successful, generate a token
    const token = jwt.sign({ email }, JWTSCECRETKEY, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token: token });
  });
});

adminRouter.delete("/admin/:id", (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM admins WHERE id = ?";

  dbConnection.query(query, [id], (error, results) => {
    if (error) {
      console.error("Error deleting admin:", error);
      return res
        .status(500)
        .json({ error: "An error occurred while deleting admin." });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Admin not found." });
    }

    return res.status(200).json({ message: "Admin deleted successfully." });
  });
});
