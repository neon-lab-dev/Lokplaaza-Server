import { User } from "../auth/auth.model";
import Category from "../category/category.model";
import Consultation from "../consultation/consultation.model";
import Customization from "../customization/customization.model";
import InspirationRequest from "../inspirationRequest/inspirationRequest.model";
import { Order } from "../order/order.model";
import Product from "../product/product.model";

const getAdminStats = async () => {
  const [
    totalUsers,
    totalCategories,
    totalProducts,
    totalOrders,
    pendingOrders,
    totalInspirationRequests,
    totalConsultations,
    totalCustomizations,
  ] = await Promise.all([
    User.countDocuments(),
    Category.countDocuments(),
    Product.countDocuments(),
    Order.countDocuments(),
    Order.countDocuments({ status: "pending" }),
    InspirationRequest.countDocuments(),
    Consultation.countDocuments(),
    Customization.countDocuments(),
  ]);

  return {
    totalUsers,
    totalCategories,
    totalProducts,
    totalOrders,
    pendingOrders,
    totalInspirationRequests,
    totalConsultations,
    totalCustomizations,
  };
};

export const AdminServices = {
  getAdminStats,
};
