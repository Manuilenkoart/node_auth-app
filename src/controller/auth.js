import { userService } from '../service/index.js';

const registration = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send();
  }

  const user = await userService.create({ email, password });

  if (!user) {
    return res.status(400).send();
  }

  res.status(200).send();
};

export const authController = {
  registration,
};
