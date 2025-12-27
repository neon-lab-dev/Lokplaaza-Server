"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("../modules/auth/auth.route");
const users_route_1 = require("../modules/users/users.route");
const product_route_1 = require("../modules/product/product.route");
const order_route_1 = require("../modules/order/order.route");
const category_route_1 = require("../modules/category/category.route");
const consultation_route_1 = require("../modules/consultation/consultation.route");
const inspirationRequest_route_1 = require("../modules/inspirationRequest/inspirationRequest.route");
const customization_route_1 = require("../modules/customization/customization.route");
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/user",
        route: users_route_1.userRoutes,
    },
    {
        path: "/auth",
        route: auth_route_1.AuthRoute,
    },
    {
        path: "/product",
        route: product_route_1.ProductRoutes,
    },
    {
        path: "/order",
        route: order_route_1.OrderRoutes,
    },
    {
        path: "/category",
        route: category_route_1.CategoryRoutes,
    },
    {
        path: "/consultation",
        route: consultation_route_1.ConsultationRoutes,
    },
    {
        path: "/inspirationRequest",
        route: inspirationRequest_route_1.InspirationRequestRoutes,
    },
    {
        path: "/customizationRequest",
        route: customization_route_1.CustomizationRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
