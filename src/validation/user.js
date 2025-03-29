import * as yup from 'yup';

const registerSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email format')
    .required('Email is required'),
  password: yup.string().min(6).required('Password is required'),
  name: yup.string().trim().min(2).required('Name is required'),
});

const loginSchema = registerSchema.pick(['email', 'password']);

const updateUserShema = yup.object({
  name: registerSchema.fields.name.optional(),
  password: yup.string().when('newPassword', {
    is: (newPassword) => !!newPassword,
    then: (schema) => schema.min(6).required('Current password is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  newPassword: registerSchema.fields.password.optional(),
  confirmPassword: yup.string().when('newPassword', {
    is: (newPassword) => !!newPassword,
    then: (schema) =>
      schema
        .oneOf(
          [yup.ref('newPassword'), null],
          'New password and confirm password do not match',
        )
        .required('Confirm password is required'),
    otherwise: (schema) => schema.notRequired(),
  }),
  newEmail: registerSchema.fields.email.optional(),
  email: yup
    .string()
    .email('Invalid email format')
    .when('newEmail', {
      is: (newEmail) => !!newEmail,
      then: (schema) =>
        schema.email('Invalid email format').required('Email is required'),
      otherwise: (schema) => schema.notRequired(),
    }),
});

export const userValidation = {
  registerSchema,
  loginSchema,
  updateUserShema,
};
