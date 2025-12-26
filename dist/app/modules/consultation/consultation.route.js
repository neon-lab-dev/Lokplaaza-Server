"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsultationRoutes = void 0;
const express_1 = __importDefault(require("express"));
const consultation_controller_1 = require("./consultation.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const auth_constannts_1 = require("../auth/auth.constannts");
const router = express_1.default.Router();
router.post("/book", consultation_controller_1.ConsultationControllers.bookConsultation);
router.get("/", (0, auth_1.default)(auth_constannts_1.UserRole.admin, auth_constannts_1.UserRole.moderator), consultation_controller_1.ConsultationControllers.getAllConsultations);
router.get("/:id", (0, auth_1.default)(auth_constannts_1.UserRole.admin, auth_constannts_1.UserRole.moderator), consultation_controller_1.ConsultationControllers.getSingleConsultation);
router.delete("/delete/:id", (0, auth_1.default)(auth_constannts_1.UserRole.admin, auth_constannts_1.UserRole.moderator), consultation_controller_1.ConsultationControllers.deleteConsultation);
exports.ConsultationRoutes = router;
