"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const multer_config_1 = require("../../config/multer.config");
const auth_constannts_1 = require("../auth/auth.constannts");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const category_controller_1 = require("./category.controller");
const router = express_1.default.Router();
router.post("/add", (0, auth_1.default)(auth_constannts_1.UserRole.admin, auth_constannts_1.UserRole.moderator), multer_config_1.multerUpload.single("file"), category_controller_1.CategoryControllers.addCategory);
router.get("/", category_controller_1.CategoryControllers.getAllCategories);
router.get("/:categoryId", category_controller_1.CategoryControllers.getSingleCategory);
router.put("/update/:categoryId", (0, auth_1.default)(auth_constannts_1.UserRole.admin, auth_constannts_1.UserRole.moderator), multer_config_1.multerUpload.single("file"), category_controller_1.CategoryControllers.updateCategory);
router.delete("/delete/:categoryId", (0, auth_1.default)(auth_constannts_1.UserRole.admin, auth_constannts_1.UserRole.moderator), category_controller_1.CategoryControllers.deleteCategory);
exports.CategoryRoutes = router;
