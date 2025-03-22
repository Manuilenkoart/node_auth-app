import UserSchema from '../model/user.js';

const create = async ({ email, password }) => {
  return UserSchema.create({ email, password });
};

export const userService = {
  create,
};
