"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const KeyLabelSchema = {
    key: { type: String, required: true },
    label: { type: String, required: true },
};
const CustomizationSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    variantType: {
        key: { type: String, required: true },
        label: { type: String, required: true },
    },
    customizations: {
        reclinerType: {
            key: { type: String, required: true },
            label: { type: String, required: true },
        },
        armrestType: {
            key: { type: String, required: true },
            label: { type: String, required: true },
        },
        middleConsole: {
            key: { type: String, required: true },
            label: { type: String, required: true },
        },
        seatType: {
            key: { type: String, required: true },
            label: { type: String, required: true },
        },
        backHeight: {
            key: { type: String, required: true },
            label: { type: String, required: true },
        },
    },
    fabric: {
        type: [KeyLabelSchema],
        required: true,
    },
    color: {
        type: [KeyLabelSchema],
        required: true,
    },
}, { timestamps: true });
const Customization = (0, mongoose_1.model)("Customization", CustomizationSchema);
exports.default = Customization;
