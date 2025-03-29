import { userService } from '../service/index.js';
import { userValidation } from '../validation/index.js';

const update = async (req, res) => {
  try {
    const { userId } = req.params;

    const validatedUserData = await userValidation.updateUserShema.validate(
      req.body,
      {
        abortEarly: false,
      },
    );

    const dbUser = await userService.findById({ id: userId });

    if (!dbUser) {
      return res.status(404).send({ error: 'User not found' });
    }

    const password = await userService.updatePassword(
      res,
      validatedUserData,
      dbUser,
    );

    const validatedEmail = await userValidation.newEmailSchema.validate(
      req.body,
    );
    const email = await userService.updateEmail(res, validatedEmail, dbUser);
    const name = userService.updateName(validatedUserData);

    const data = Object.entries({ password, email, name }).reduce(
      (acc, [key, value]) => {
        if (value) {
          acc[key] = value;
        }

        return acc;
      },
      {},
    );

    const updatedUser = await userService.update({ data, id: userId });

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
