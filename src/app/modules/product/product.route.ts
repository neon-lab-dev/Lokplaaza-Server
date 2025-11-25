import express from "express";
import { ProductControllers } from "./product.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "../auth/auth.constannts";
import { multerUpload } from "../../config/multer.config";

const router = express.Router();

// For admin only
router.post(
  "/add",
  auth(UserRole.admin, UserRole.moderator),
  multerUpload.array("files", 4),
  ProductControllers.addProduct
);

// Get all products
router.get("/", ProductControllers.getAllProducts);

// Get single product by ID
router.get("/:productId", ProductControllers.getSingleProductById);

// Update product
router.put(
  "/update/:productId",
  auth(UserRole.admin, UserRole.moderator),
  multerUpload.array("files", 4),
  ProductControllers.updateProduct
);

// Delete product
router.delete(
  "/delete/:productId",
  auth(UserRole.admin, UserRole.moderator),
  ProductControllers.deleteProduct
);

export const ProductRoutes = router;
