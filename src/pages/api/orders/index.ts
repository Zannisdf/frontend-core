import { timeSlotsService } from "@frontend-core/client/time-slots/time-slots.service";
import { userService } from "@frontend-core/client/users/user.service";
import { ordersClient } from "@frontend-core/server/orders";
import { paymentsService } from "@frontend-core/server/payments/payments-service";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { NextApiRequest, NextApiResponse } from "next";

const createOrder = async (req: NextApiRequest, res: NextApiResponse) => {
  const { itemId, email, name, phone, authorization, termsAndConditions } =
    req.body;

  try {
    const timeSlot = await timeSlotsService.get(itemId);

    if (!timeSlot) {
      throw new Error(`TimeSlot with id ${itemId} was not found.`);
    }

    const user = await userService.getUser(timeSlot.practitionerId);

    if (!user) {
      throw new Error(`User with id ${timeSlot.practitionerId} was not found.`);
    }

    await ordersClient.create(itemId, {
      itemId,
      customerEmail: email,
      customerPhone: phone,
      customerName: name,
      authorization,
      termsAndConditions,
      start: timeSlot.start,
      intervalInMinutes: timeSlot.intervalInMinutes,
      practiceAddress: timeSlot.practiceAddress,
      practitionerId: timeSlot.practitionerId,
      practitionerName: `${user.names} ${user.surnames}`,
      practitionerEmail: user.email,
      status: "PENDING",
    });

    await timeSlotsService.updateTimeSlot(itemId, { status: "RESERVED" });

    const { url, token } = await paymentsService.createPayment({
      itemId,
      description: "Venta de sobrecupo",
      amount: 2990,
      email,
    });

    return res.status(201).json({ url: `${url}?token=${token}` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({});
  }
};

const getOrder = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = req.query["id"];

  if (!id || typeof id !== "string") {
    return res.status(404).json({ notFound: true });
  }

  const order = await ordersClient.get(id);
 
  return res.status(200).json(order);
};

const orders = (req: NextApiRequest, res: NextApiResponse) => {
  const method = req.method?.toUpperCase();

  if (method === "GET") {
    return getOrder(req, res);
  }

  if (method === "POST") {
    return createOrder(req, res);
  }
};

export default orders;
