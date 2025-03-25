import UserSchema from '../model/user.js';

const dto = ({ id, email }) => ({ id, email });

const create = ({ email, password, name, activationToken }) => {
  return UserSchema.create({
    email,
    password,
    name,
    activationToken,
  });
};

const findByEmail = ({ email }) => {
  return UserSchema.findOne({ where: { email } });
};

export const userService = {
  dto,
  create,
  findByEmail,
};
