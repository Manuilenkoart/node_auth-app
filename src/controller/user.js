import { userService } from '../service/index.js';

const update = async (req, res) => {
  try {
    const { userId } = req.params;

    const updatedUser = await userService.update({
      data: req.body,
      id: userId,
    });

    if (!updatedUser.success) {
      return res.status(400).send(updatedUser.error);
    }

    const user = await userService.findById({ id: userId });

    res.send(userService.dto(user));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);

    res.status(500).send();
  }
};

export const userController = {
  update,
};
