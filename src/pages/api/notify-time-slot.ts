import { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";

function buildMessage({
  email,
  timeSlots,
}: {
  email: string;
  timeSlots: Record<string, any>;
}) {
  const paragraphs = [
    `Se modificó el calendario de: ${email}\n`,
    `Horarios eliminados:`,
    `${
      timeSlots.deleted.length > 0 ? timeSlots.deleted.join("\n") : "Ninguno"
    }`,
    `Horarios agregados:`,
    `${timeSlots.added.length > 0 ? timeSlots.added.join("\n") : "Ninguno"} `,
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
    to: process.env.TIME_SLOT_NOTIFICATION_RECIPIENTS,
    subject: `Se modificaron los sobrecupos de ${data.email}`,
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
