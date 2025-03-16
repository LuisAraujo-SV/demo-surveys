const authService = require('../services/auth.service');
const { registerDto, loginDto } = require('../dto/auth.dto');
const { catchAsync } = require('../utils/catchAsync');

class AuthController {
  
  register = catchAsync(async (req, res) => {
    const validatedData = registerDto.parse(req.body);
    const result = await authService.register(validatedData);
    res.status(201).json(result);
  });

  
  login = catchAsync(async (req, res) => {
    const validatedData = loginDto.parse(req.body);
    const result = await authService.login(validatedData.email, validatedData.password);
    res.json(result);
  });
}

module.exports = new AuthController(); 