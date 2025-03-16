const express = require('express');
const auth = require('../middleware/auth');
const userController = require('../controllers/user.controller');

const router = express.Router();

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User profile
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', auth, userController.getProfile);

router.patch('/profile', auth, userController.updateProfile);

/**
 * @swagger
 * /users/surveys/history:
 *   get:
 *     summary: Get user's survey response history
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: List of completed surveys
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   survey:
 *                     $ref: '#/components/schemas/Survey'
 *                   points_earned:
 *                     type: integer
 *                   created_at:
 *                     type: string
 *                     format: date-time
 *       401:
 *         description: Unauthorized
 */
router.get('/surveys/history', auth, userController.getSurveyHistory);

router.get('/points/summary', auth, userController.getUserStats);

router.post('/change-password', auth, userController.changePassword);

module.exports = router; 