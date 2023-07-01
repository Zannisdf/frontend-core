import { OrderDoc, ordersClient } from "@frontend-core/server/orders";
import { paymentsService } from "@frontend-core/server/payments/payments-service";
import nodemailer from "nodemailer";
import { NextApiRequest, NextApiResponse } from "next";
import { timeSlotsService } from "@frontend-core/client/time-slots/time-slots.service";

export const config = {
  runtime: 'edge'
}

const formatDate = (date: Date, intervalInMinutes: number) => {
  const readableDate = new Intl.DateTimeFormat("es-CL", {
    dateStyle: "full",
    timeZone: "America/Santiago",
  }).format(date);
  const hourFormatter = new Intl.DateTimeFormat("es-CL", {
    timeStyle: "short",
    timeZone: "America/Santiago",
  });
  const endDate = new Date(date.getTime() + intervalInMinutes * 60 * 1000);
  const startHours = hourFormatter.format(date);
  const endHours = hourFormatter.format(endDate);

  return `${
    readableDate[0].toUpperCase() + readableDate.slice(1)
  } a las ${startHours} - ${endHours}`;
};

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
      "Al momento de llegar, por favor dirígete a recepción o caja indicando tu sobrecupo y paga tu consulta donde corresponda.\n",
      "Detalles del sobrecupo solicitado:\n",
      `Profesional: ${order.practitionerName}`,
      `Fecha de atención: ${formatDate(order.start, order.intervalInMinutes)}`,
      `Dirección: ${order.practiceAddress}\n`,
      "Gracias por tu preferencia.",
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
      "Tienes un nuevo sobrecupo, a continuación adjuntamos los detalles:\n",
      "Datos del paciente:",
      `Nombre: ${order.customerName}`,
      `Email: ${order.customerEmail}`,
      `Teléfono: ${order.customerPhone}\n`,
      `Fecha: ${formatDate(order.start, order.intervalInMinutes)}`,
      `Dirección: ${order.practiceAddress}\n`,
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
    }

    if (response.status === 3 || response.status === 4) {
      await Promise.all([
        ordersClient.delete(response.commerceOrder),
        timeSlotsService.updateTimeSlot(response.commerceOrder, {
          status: "FREE",
        }),
      ]);
    }

    return res.status(200).json({ status: "ok" });
  } catch (error) {
    console.error("Something went wrong: ", error);

    return res.status(500).json({});
  }
};

export default authorize;
