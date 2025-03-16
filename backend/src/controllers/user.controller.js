const userService = require('../services/user.service');
const { updateProfileDto, changePasswordDto } = require('../dto/user.dto');
const { catchAsync } = require('../utils/catchAsync');

class UserController {
  
  getProfile = catchAsync(async (req, res) => {
    const profile = await userService.getProfile(req.user.id);
    res.json(profile);
  });

  
  updateProfile = catchAsync(async (req, res) => {
    const validatedData = updateProfileDto.parse(req.body);
    const updatedProfile = await userService.updateProfile(req.user.id, validatedData);
    res.json(updatedProfile);
  });

  
  changePassword = catchAsync(async (req, res) => {
    const validatedData = changePasswordDto.parse(req.body);
    const result = await userService.changePassword(
      req.user.id,
      validatedData.currentPassword,
      validatedData.newPassword
    );
    res.json(result);
  });

  
  getUserStats = catchAsync(async (req, res) => {
    const stats = await userService.getUserStats(req.user.id);
    res.json(stats);
  });

  
  getSurveyHistory = catchAsync(async (req, res) => {
    const history = await userService.getSurveyHistory(req.user.id);
    res.json(history);
  });
}

module.exports = new UserController(); 