"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomizationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const customization_controller_1 = require("./customization.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const auth_constannts_1 = require("../auth/auth.constannts");
const router = express_1.default.Router();
// Create customization request
router.post("/submit", customization_controller_1.CustomizationControllers.postCustomizationRequest);
// Get all customization requests (admin/moderator)
router.get("/", (0, auth_1.default)(auth_constannts_1.UserRole.admin, auth_constannts_1.UserRole.moderator), customization_controller_1.CustomizationControllers.getAllCustomizationRequests);
// Get single customization request by ID
router.get("/:id", (0, auth_1.default)(auth_constannts_1.UserRole.admin, auth_constannts_1.UserRole.moderator), customization_controller_1.CustomizationControllers.getSingleRequestById);
exports.CustomizationRoutes = router;
