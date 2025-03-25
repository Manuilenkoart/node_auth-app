import { userService } from '../service/index.js';

const update = async (req, res) => {
  try {
    const { userId } = req.params;

    const updatedUser = await userService.update({
      data: req.body,
      id: userId,
    });

    if (!updatedUser) {
      return res.status(400).send();
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
