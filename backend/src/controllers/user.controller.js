const userService = require('../services/user.service');
const { updateProfileDto, changePasswordDto } = require('../dto/user.dto');
const { catchAsync } = require('../utils/catchAsync');

class UserController {
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
   *         description: User profile data
   *       404:
   *         description: User not found
   */
  getProfile = catchAsync(async (req, res) => {
    const profile = await userService.getProfile(req.user.id);
    res.json(profile);
  });

  /**
   * @swagger
   * /users/profile:
   *   patch:
   *     summary: Update user profile
   *     tags: [Users]
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               name:
   *                 type: string
   *               category:
   *                 type: string
   *                 enum: [Technology, Healthcare, Education, Finance, Entertainment, Other]
   *     responses:
   *       200:
   *         description: Profile updated successfully
   *       400:
   *         description: Invalid input data
   */
  updateProfile = catchAsync(async (req, res) => {
    const validatedData = updateProfileDto.parse(req.body);
    const updatedProfile = await userService.updateProfile(req.user.id, validatedData);
    res.json(updatedProfile);
  });

  /**
   * @swagger
   * /users/change-password:
   *   post:
   *     summary: Change user password
   *     tags: [Users]
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - currentPassword
   *               - newPassword
   *             properties:
   *               currentPassword:
   *                 type: string
   *               newPassword:
   *                 type: string
   *     responses:
   *       200:
   *         description: Password changed successfully
   *       401:
   *         description: Current password is incorrect
   */
  changePassword = catchAsync(async (req, res) => {
    const validatedData = changePasswordDto.parse(req.body);
    const result = await userService.changePassword(
      req.user.id,
      validatedData.currentPassword,
      validatedData.newPassword
    );
    res.json(result);
  });

  /**
   * @swagger
   * /users/stats:
   *   get:
   *     summary: Get user statistics
   *     tags: [Users]
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       200:
   *         description: User statistics
   *       404:
   *         description: User not found
   */
  getUserStats = catchAsync(async (req, res) => {
    const stats = await userService.getUserStats(req.user.id);
    res.json(stats);
  });

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
   *                     type: object
   *                     properties:
   *                       id:
   *                         type: integer
   *                       title:
   *                         type: string
   *                       category:
   *                         type: string
   *                       pointsReward:
   *                         type: integer
   *                       description:
   *                         type: string
   *                   answers:
   *                     type: object
   *                   points_earned:
   *                     type: integer
   *                   created_at:
   *                     type: string
   *                     format: date-time
   *       401:
   *         description: Unauthorized
   */
  getSurveyHistory = catchAsync(async (req, res) => {
    const history = await userService.getSurveyHistory(req.user.id);
    res.json(history);
  });
}

module.exports = new UserController(); 