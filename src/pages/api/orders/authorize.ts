import { OrderDoc, ordersClient } from "@frontend-core/server/orders";
import { paymentsService } from "@frontend-core/server/payments/payments-service";
import nodemailer from "nodemailer";
import { NextApiRequest, NextApiResponse } from "next";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const formatDate = (date: Date) => format(date, "PPPPpppp", { locale: es });

const sendUserEmail = (order: OrderDoc) => {
  const transporter = nodemailer.createTransport({
    service: process.env.MAILER_SERVICE,
    auth: {
      user: process.env.MAILER_EMAIL,
      pass: process.env.MAILER_PASSWORD,
    },
  });

  const message = {
    from: `Equipo de Sobrecupos <${process.env.MAILER_EMAIL}>`,
    to: order.customerEmail,
    subject: `Detalle de tu sobrecupo`,
    text: [
      `Hola ${order.customerName},`,
      "Hemos recibido tu solicitud de sobrecupo 😃",
      "Al momento de llegar, por favor dirígete a recepción o caja indicando tu sobrecupo y paga tu consulta donde corresponda.",
      "\n",
      "Detalles del sobrecupo solicitado:",
      "\n",
      `Profesional: ${order.practitionerName}`,
      `Fecha de atención: ${formatDate(order.start)}`,
      `Dirección: ${order.practiceAddress}`,
      "\n",
      "Gracias por su preferencia.",
    ].join("\n"),
  };

  return transporter.sendMail(message);
};

const sendPractitionerEmail = (order: OrderDoc) => {
  const transporter = nodemailer.createTransport({
    service: process.env.MAILER_SERVICE,
    auth: {
      user: process.env.MAILER_EMAIL,
      pass: process.env.MAILER_PASSWORD,
    },
  });

  const message = {
    from: `Equipo de Sobrecupos <${process.env.MAILER_EMAIL}>`,
    to: order.practitionerEmail,
    subject: `Tienes un nuevo sobrecupo`,
    text: [
      `Hola ${order.practitionerName},`,
      "Tienes un nuevo sobrecupo, a continuación adjuntamos los detalles:",
      "\n",
      "Datos del paciente:",
      `Nombre: ${order.customerName}`,
      `Email: ${order.customerEmail}`,
      `Teléfono: ${order.customerPhone}`,
      "\n",
      "Fecha:",
      formatDate(order.start),
      "\n",
      "Ubicación:",
      order.practiceAddress,
      "\n",
      "¡Que tengas un excelente día!",
    ].join("\n"),
  };

  return transporter.sendMail(message);
};

const authorize = async (req: NextApiRequest, res: NextApiResponse) => {
  const { token } = req.body;

  try {
    const response = await paymentsService.getPaymentStatus(token);

    if (response.status === 2) {
      await ordersClient.update(response.commerceOrder, { status: "PAID" });
      const order = await ordersClient.get(response.commerceOrder);

      if (!order) {
        throw new Error(`Order ${response.commerceOrder} was not found`);
      }

      await Promise.all([sendUserEmail(order), sendPractitionerEmail(order)]);

      return res.status(200).json({ status: "ok" });
    }

    console.error("Something went wrong: ", response);

    return res.status(500).json({});
  } catch (error) {
    console.error("Something went wrong: ", error);

    return res.status(500).json({});
  }
};

export default authorize;
