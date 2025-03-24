import UserSchema from '../model/user.js';

const dto = ({ id, email }) => ({ id, email });

const create = async ({ email, password, activationToken }) => {
  return UserSchema.create({ email, password, activationToken });
};

export const userService = {
  dto,
  create,
};
