import { v4 as uuidv4 } from 'uuid';
import { emailService, tokensService, userService } from '../service/index.js';
import UserSchema from '../model/user.js';
import { jwtService } from '../service/jwt.js';
import bcrypt from 'bcrypt';

const registration = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).send();
    }

    const activationToken = uuidv4();
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userService.create({
      email,
      password: hashedPassword,
      name,
      activationToken,
    });

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

    if (!user) {
      return res.status(401).send();
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).send();
    }

    await generateTokens(res, user);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);

    res.status(500).send();
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken = '' } = req.cookie;

    const user = jwtService.verifyRefresh(refreshToken);

    if (user) {
      await tokensService.deleteToken(user.id);
    }

    res.clearCookie('refreshToken');
    res.status(204).send();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);

    res.status(500).send();
  }
};

const refresh = async (req, res) => {
  const { refreshToken } = req.cookies;

  const user = jwtService.verifyRefresh(refreshToken);
  const token = await tokensService.getByToken(refreshToken);

  if (!user || !token) {
    return res.status(401).send();
  }

  await generateTokens(res, user);
};

const generateTokens = async (res, user) => {
  const userDto = userService.dto(user);

  const accessToken = jwtService.signAccess(userDto);
  const refreshToken = jwtService.signRefresh(userDto);

  await tokensService.save({ userId: userDto.id, newToken: refreshToken });

  res.cookie('refreshToken', refreshToken, {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    httpOnly: true,
  });

  res.send({
    accessToken,
  });
};

export const authController = {
  registration,
  activateUser,
  login,
  logout,
  refresh,
};
