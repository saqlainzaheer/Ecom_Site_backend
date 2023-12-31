import { Router } from "express";
import { dbConnection } from "../index.js";
import { uploadFile } from "../middleware/fileupload.js";

export const productRouter = Router();

productRouter.post("/product", uploadFile.array("images", 5), (req, res) => {
  try {
    // Extract product data from both form fields and uploaded files
    const { name, price, category, color, description } = req.body;

    // Extract file paths from uploaded files
    const imagePaths = req.files.map((file) => file.path);

    // Concatenate image paths into a comma-separated string
    const imagePathsString = imagePaths.join(",");

    // Insert product data into the 'products' table
    dbConnection.query(
      "INSERT INTO products (name, price, category, color, description, image_urls) VALUES (?, ?, ?, ?, ?, ?)",
      [name, price, category, color, description, imagePathsString],
      (error) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          res.status(201).json({ message: "Product created successfully" });
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
