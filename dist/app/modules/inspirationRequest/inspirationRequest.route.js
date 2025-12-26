"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InspirationRequestRoutes = void 0;
const express_1 = __importDefault(require("express"));
const inspirationRequest_controller_1 = require("./inspirationRequest.controller");
const multer_config_1 = require("../../config/multer.config");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const auth_constannts_1 = require("../auth/auth.constannts");
const router = express_1.default.Router();
router.post("/upload", multer_config_1.multerUpload.single("file"), inspirationRequest_controller_1.InspirationRequestControllers.uploadInspirationImage);
router.get("/", (0, auth_1.default)(auth_constannts_1.UserRole.admin, auth_constannts_1.UserRole.moderator), inspirationRequest_controller_1.InspirationRequestControllers.getAllInspirationRequests);
router.delete("/delete/:id", (0, auth_1.default)(auth_constannts_1.UserRole.admin, auth_constannts_1.UserRole.moderator), inspirationRequest_controller_1.InspirationRequestControllers.deleteInspirationRequest);
exports.InspirationRequestRoutes = router;
