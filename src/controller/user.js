import { userService } from '../service/index.js';
import { userValidation } from '../validation/index.js';
import bcrypt from 'bcrypt';

const update = async (req, res) => {
  try {
    const { userId } = req.params;

    const data = await userValidation.updateUserShema.validate(req.body, {
      abortEarly: false,
    });

    if (data?.password) {
      const dbUser = await userService.findById({ id: userId });

      const isPasswordCorrect = await bcrypt.compare(
        data.password,
        dbUser.password,
      );

      if (!isPasswordCorrect) {
        return res.status(401).send({ error: 'Incorrect current password' });
      }

      const hashedPassword = await bcrypt.hash(data.confirmPassword, 10);

      data['password'] = hashedPassword;
      delete data['newPassword'];
      delete data['confirmPassword'];
    }

    const updatedUser = await userService.update({
      data,
      id: userId,
    });

    if (!updatedUser.success) {
      return res.status(400).send(updatedUser.error);
    }

    const user = await userService.findById({ id: userId });

    res.send(userService.dto(user));
  } catch (error) {
    if (error?.errors) {
      return res.status(400).send({ error: error.errors });
    }
    // eslint-disable-next-line no-console
    console.error(error);

    res.status(500).send();
  }
};

export const userController = {
  update,
};
