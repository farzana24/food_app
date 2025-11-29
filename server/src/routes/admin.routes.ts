import { Router } from 'express';
import { AdminRestaurantController } from '../controllers/admin.restaurant.controller';
import { authenticate, requireRole } from '../middleware/auth';

const router = Router();
const controller = new AdminRestaurantController();

// All routes require ADMIN role
router.use(authenticate);
router.use(requireRole(['ADMIN']));

// GET /api/admin/restaurants - Get all restaurants with pagination and filters
router.get('/restaurants', (req, res) => controller.getRestaurants(req, res));

// GET /api/admin/restaurants/:id - Get single restaurant
router.get('/restaurants/:id', (req, res) => controller.getRestaurant(req, res));

// PUT /api/admin/restaurants/:id/approve - Approve or reject restaurant
router.put('/restaurants/:id/approve', (req, res) => controller.approveRestaurant(req, res));

// PUT /api/admin/restaurants/:id/suspend - Suspend or unsuspend restaurant
router.put('/restaurants/:id/suspend', (req, res) => controller.suspendRestaurant(req, res));

export default router;
