import jwt from 'jsonwebtoken';

const { JWT_PRIVATE_KEY } = process.env;

const sign = (user) => {
  const token = jwt.sign(user, JWT_PRIVATE_KEY);

  return token;
};

const verify = (token) => {
  try {
    return jwt.verify(token, JWT_PRIVATE_KEY);
  } catch (error) {
    return null;
  }
};

export const jwtService = {
  sign,
  verify,
};
