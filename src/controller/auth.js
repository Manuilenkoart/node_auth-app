import { v4 as uuidv4 } from 'uuid';
import { emailService, userService } from '../service/index.js';
import UserSchema from '../model/user.js';

const registration = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send();
  }

  const activationToken = uuidv4();
  const user = await userService.create({ email, password, activationToken });

  if (!user) {
    return res.status(400).send();
  }

  await emailService.sendActivation({ email, activationToken });

  res.status(200).send();
};

const activateUser = async (req, res) => {
  const { activationToken } = req.params;

  const user = await UserSchema.findOne({ where: { activationToken } });

  if (!user) {
    return res.status(404).send();
  }

  user.activationToken = null;
  user.save(); // Save the updated user to the database

  res.send(user);
};

export const authController = {
  registration,
  activateUser,
};
