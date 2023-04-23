import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

function buildMessage({
  email,
  activationLink,
}: {
  email: string;
  activationLink: string;
}) {
  const paragraphs = [
    `Se creó un usuario con correo: ${email}\n`,
    `Si el usuario corresponde a un médico ya registrado, actívalo acá:`,
    `${activationLink}\n`,
    `No respondas este mensaje :)`,
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

  const message = {
    from: `Sobrecupos.app <${process.env.MAILER_EMAIL}>`,
    to: process.env.USER_CREATED_NOTIFICATION_RECIPIENTS,
    subject: `Se creó un usuario para ${data.email}`,
    text: buildMessage(data),
  };

  return transporter
    .sendMail(message)
    .then((serverResponse) => res.status(200).json(serverResponse))
    .catch((serverError) => {
      console.log(serverError);
      return res.status(400).json(serverError);
    });
};
