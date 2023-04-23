import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

function buildMessage() {
  const paragraphs = [
    `¡Hola! Te doy la bienvenida a Sobrecupos.\n`,
    `Ya puedes cargar tus sobrecupos usando el siguiente link: https://www.sobrecupos.app/sobrecupos\n`,
    `Si tienes alguna duda no dudes en escribirme.`,
    `Giorgio, CTO.`
  ];

  return paragraphs.join("\n");
}

export default (req: NextApiRequest, res: NextApiResponse) => {
  const transporter = nodemailer.createTransport({
    service: process.env.MAILER_SERVICE,
    auth: {
      user: process.env.MAILER_EMAIL,
      pass: process.env.MAILER_PASSWORD,
    },
  });

  const data = JSON.parse(req.body);

  console.log('sending', data.email)

  const message = {
    from: `Giorgio de Sobrecupos <${process.env.MAILER_EMAIL}>`,
    to: data.email,
    subject: `¡Bienvenido a Sobrecupos!`,
    text: buildMessage(),
  };

  return transporter
    .sendMail(message)
    .then((serverResponse) => res.status(200).json(serverResponse))
    .catch((serverError) => {
      console.log(serverError);
      return res.status(400).json(serverError);
    });
};
