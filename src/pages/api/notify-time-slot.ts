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
    `${timeSlots.deleted.join("\n")}\n`,
    `Horarios agregados:`,
    `${timeSlots.added.join("\n")}\n`,
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

  const message = {
    from: `Sobrecupos.app <${process.env.MAILER_EMAIL}>`,
    to: process.env.TIME_SLOT_NOTIFICATION_RECIPIENTS,
    subject: "Se modificó un sobrecupo a través de sobrecupos.app",
    text: buildMessage(JSON.parse(req.body)),
  };

  return transporter
    .sendMail(message)
    .then((serverResponse) => res.status(200).json(serverResponse))
    .catch((serverError) => {
      console.log(serverError);
      return res.status(400).json(serverError);
    });
};
