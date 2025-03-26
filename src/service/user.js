import UserSchema from '../model/user.js';

const dto = ({ id, email, name }) => ({ id, email, name });

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

const findById = ({ id }) => {
  return UserSchema.findOne({ where: { id } });
};

const update = ({ data, id }) => {
  return UserSchema.update(data, { where: { id } })
    .then(([rowsUpdate]) => {
      if (rowsUpdate === 0) {
        throw new Error('Update failed');
      }

      return { success: true };
    })
    .catch((error) => {
      return { success: false, error: error.message };
    });
};

export const userService = {
  dto,
  create,
  findByEmail,
  findById,
  update,
};
