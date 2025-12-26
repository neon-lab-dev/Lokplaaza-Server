"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InspirationRequestControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const inspirationRequest_services_1 = require("./inspirationRequest.services");
// Upload inspiration image
const uploadInspirationImage = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    const result = yield inspirationRequest_services_1.InspirationRequestServices.uploadInspirationImage(req.body, file);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: "Inspiration request submitted successfully",
        data: result,
    });
}));
// Get all inspiration requests (admin)
const getAllInspirationRequests = (0, catchAsync_1.default)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield inspirationRequest_services_1.InspirationRequestServices.getAllInspirationRequests();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Inspiration requests fetched successfully",
        data: {
            consultations: result, // matches frontend usage
        },
    });
}));
// Delete inspiration request (admin)
const deleteInspirationRequest = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield inspirationRequest_services_1.InspirationRequestServices.deleteInspirationRequest(id);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Inspiration request deleted successfully",
        data: null,
    });
}));
exports.InspirationRequestControllers = {
    uploadInspirationImage,
    getAllInspirationRequests,
    deleteInspirationRequest,
};
