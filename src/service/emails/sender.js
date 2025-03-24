import { transporter } from './setupTransport.js';

const { EMAIL_USER } = process.env;

const sendEmail = async ({ to, subject, html }) => {
  return transporter.sendMail({
    from: `"Booo 👻" ${EMAIL_USER}`, // sender address
    to, // list of receivers
    subject, // Subject line
    html, // html body
  });
};

const sendActivation = async ({ email, activationToken }) => {
  const href = `${process.env.CLIENT_HOST}/activate/${activationToken}`;

  const html = `
    <h1>Activate account</h1>
    <a href="${href}">${href}</a>
  `;

  return sendEmail({ to: email, subject: 'Activate account', html });
};

export const emailService = { sendActivation };
