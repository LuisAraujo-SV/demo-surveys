const express = require('express');
const { z } = require('zod');
const auth = require('../middleware/auth');
const User = require('../models/User');
const SurveyResponse = require('../models/SurveyResponse');
const Survey = require('../models/Survey');
const { sequelize } = require('sequelize');
const { fn } = require('sequelize');

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
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'category', 'points']
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Actualizar perfil del usuario
const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  category: z.enum(['Tecnología', 'Deportes', 'Moda']).optional()
});

router.patch('/profile', auth, async (req, res) => {
  try {
    const validatedData = updateProfileSchema.parse(req.body);
    await req.user.update(validatedData);
    
    res.json({
      message: 'Perfil actualizado correctamente',
      user: {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        category: req.user.category,
        points: req.user.points
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Datos inválidos', errors: error.errors });
    }
    res.status(500).json({ message: 'Error en el servidor' });
  }
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
 *                     $ref: '#/components/schemas/Survey'
 *                   answers:
 *                     type: object
 *                   points_earned:
 *                     type: integer
 *                   created_at:
 *                     type: string
 *                     format: date-time
 */
router.get('/surveys/history', auth, async (req, res) => {
  try {
    const responses = await SurveyResponse.findAll({
      where: { user_id: req.user.id },
      include: [{
        model: Survey, as: 'survey',
        attributes: ['title', 'category', 'points']
      }],
      order: [['created_at', 'DESC']]
    });

    res.json(responses);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

// Obtener resumen de puntos
router.get('/points/summary', auth, async (req, res) => {
  try {
    const totalPoints = req.user.points;
    const surveyCount = await SurveyResponse.count({
      where: { userId: req.user.id }
    });

    const pointsByCategory = await SurveyResponse.findAll({
      attributes: [
        [sequelize.col('Survey.category'), 'category'],
        [sequelize.fn('SUM', sequelize.col('pointsEarned')), 'total']
      ],
      include: [{
        model: Survey,
        attributes: []
      }],
      where: { userId: req.user.id },
      group: ['Survey.category']
    });

    res.json({
      totalPoints,
      surveyCount,
      pointsByCategory
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

module.exports = router; 