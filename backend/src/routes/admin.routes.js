const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser, updateUserRole } = require('../controllers/admin.controller');
const { protect, authorize } = require('../middleware/auth');

// All admin routes require authentication + admin role
router.use(protect, authorize('admin'));

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin-only operations (requires admin role)
 */

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of all users
 *       403:
 *         description: Not authorized (admin only)
 */
router.get('/users', getAllUsers);

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Delete a user and their tasks (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
 */
router.delete('/users/:id', deleteUser);

/**
 * @swagger
 * /admin/users/{id}/role:
 *   patch:
 *     summary: Update a user's role (admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - role
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *     responses:
 *       200:
 *         description: Role updated
 *       404:
 *         description: User not found
 */
router.patch('/users/:id/role', updateUserRole);

module.exports = router;
