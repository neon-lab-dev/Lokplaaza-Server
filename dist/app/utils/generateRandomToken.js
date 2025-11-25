"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomToken = void 0;
// utils/generateRandomToken.ts
const generateRandomToken = (length = 10) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
};
exports.generateRandomToken = generateRandomToken;
