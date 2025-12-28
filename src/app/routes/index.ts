import { Router } from "express";
import { AuthRoute } from "../modules/auth/auth.route";
import { UserRoutes } from "../modules/users/users.route";
import { ProductRoutes } from "../modules/product/product.route";
import { OrderRoutes } from "../modules/order/order.route";
import { CategoryRoutes } from "../modules/category/category.route";
import { ConsultationRoutes } from "../modules/consultation/consultation.route";
import { InspirationRequestRoutes } from "../modules/inspirationRequest/inspirationRequest.route";
import { CustomizationRoutes } from "../modules/customization/customization.route";
import { AdminRoutes } from "../modules/admin/admin.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
  {
    path: "/admin",
    route: AdminRoutes,
  },
  {
    path: "/auth",
    route: AuthRoute,
  },
  {
    path: "/product",
    route: ProductRoutes,
  },
  {
    path: "/order",
    route: OrderRoutes,
  },
  {
    path: "/category",
    route: CategoryRoutes,
  },
  {
    path: "/consultation",
    route: ConsultationRoutes,
  },
  {
    path: "/inspirationRequest",
    route: InspirationRequestRoutes,
  },
  {
    path: "/customizationRequest",
    route: CustomizationRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
