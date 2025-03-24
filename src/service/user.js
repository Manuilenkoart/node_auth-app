import UserSchema from '../model/user.js';

const create = async ({ email, password, activationToken }) => {
  return UserSchema.create({ email, password, activationToken });
};

export const userService = {
  create,
};
