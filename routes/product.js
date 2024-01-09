import { Router } from "express";
import { dbConnection } from "../index.js";
import { uploadFile } from "../middleware/fileupload.js";

export const productRouter = Router();

productRouter.post("/product", uploadFile.array("images", 5), (req, res) => {
  try {
    // Extract product data from both form fields and uploaded files
    const {
      title,
      price,
      discountPercentage,
      discountedPrice,
      metaDescription,
    } = req.body;

    // Extract file paths from uploaded files
    const imagePaths = req.files.map((file) => file.path);

    // Concatenate image paths into a comma-separated string
    const imagePathsString = imagePaths.join(",");

    // Insert product data into the 'products' table
    dbConnection.query(
      "INSERT INTO products (title, price, discountPercentage, discountedPrice, metaDescription, imagePaths) VALUES (?, ?, ?, ?, ?, ?)",
      [
        title,
        price,
        discountPercentage,
        discountedPrice,
        metaDescription,
        imagePathsString,
      ],
      (error, result) => {
        if (error) {
          console.error(error);
          res.status(500).json({ error: "Internal Server Error" });
        } else {
          res.status(201).json({
            message: "Product created successfully",
            productId: result.insertId,
          });
        }
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
productRouter.get("/products", (req, res) => {
  try {
    // Retrieve all products from the 'products' table
    dbConnection.query("SELECT * FROM products", (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
      } else {
        res.status(200).json({ products: results });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
// API endpoint to insert categories
productRouter.post("/categories", (req, res) => {
  const categories = req.body.categories;

  if (!categories || !Array.isArray(categories) || categories.length === 0) {
    return res.status(400).json({ error: "Invalid input data" });
  }

  // Create a promise to handle the asynchronous database operations
  const insertCategoryPromises = categories.map((category) => {
    return new Promise((resolve, reject) => {
      const {
        product_id,
        colorname,
        color,
        size_small,
        size_medium,
        size_large,
      } = category;

      const sql =
        "INSERT INTO category (product_id, colorname, color, size_small, size_medium, size_large) VALUES (?, ?, ?, ?, ?, ?)";
      const values = [
        product_id,
        colorname,
        color,
        size_small,
        size_medium,
        size_large,
      ];

      db.query(sql, values, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  });

  // Execute all promises and send the response once all are resolved
  Promise.all(insertCategoryPromises)
    .then(() => {
      res.status(201).json({ message: "Categories inserted successfully" });
    })
    .catch((error) => {
      console.error("Error inserting categories: ", error);
      res.status(500).json({ error: "Internal Server Error" });
    });
});
