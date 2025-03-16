const authService = require('../services/auth.service');
const { registerDto, loginDto } = require('../dto/auth.dto');
const { catchAsync } = require('../utils/catchAsync');

class AuthController {
  /**
   * @swagger
   * /auth/register:
   *   post:
   *     summary: Register a new user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - email
   *               - password
   *               - category
   *             properties:
   *               name:
   *                 type: string
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *                 format: password
   *               category:
   *                 type: string
   *                 enum: [Technology, Healthcare, Education, Finance, Entertainment, Other]
   *     responses:
   *       201:
   *         description: User registered successfully
   *       400:
   *         description: Invalid input data or email already registered
   */
  register = catchAsync(async (req, res) => {
    const validatedData = registerDto.parse(req.body);
    const result = await authService.register(validatedData);
    res.status(201).json(result);
  });

  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Login user
   *     tags: [Auth]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - email
   *               - password
   *             properties:
   *               email:
   *                 type: string
   *                 format: email
   *               password:
   *                 type: string
   *                 format: password
   *     responses:
   *       200:
   *         description: Login successful
   *       401:
   *         description: Invalid credentials
   */
  login = catchAsync(async (req, res) => {
    const validatedData = loginDto.parse(req.body);
    const result = await authService.login(validatedData.email, validatedData.password);
    res.json(result);
  });
}

module.exports = new AuthController(); 