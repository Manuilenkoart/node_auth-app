import { v4 as uuidv4 } from 'uuid';
import { emailService, userService } from '../service/index.js';
import UserSchema from '../model/user.js';
import { jwtService } from '../service/jwt.js';

const registration = async (req, res) => {
  try {
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
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);

    res.status(500).send();
  }
};

const activateUser = async (req, res) => {
  try {
    const { activationToken } = req.params;

    const user = await UserSchema.findOne({ where: { activationToken } });

    if (!user) {
      return res.status(404).send();
    }

    user.activationToken = null;
    user.save(); // Save the updated user to the database

    res.send(userService.dto(user));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);

    res.status(500).send();
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userService.findByEmail({ email });

    if (!user || user.password !== password) {
      return res.status(401).send();
    }

    const userDto = userService.dto(user);
    const accessToken = jwtService.sign(userDto);

    res.send({
      accessToken,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);

    res.status(500).send();
  }
};

export const authController = {
  registration,
  activateUser,
  login,
};
