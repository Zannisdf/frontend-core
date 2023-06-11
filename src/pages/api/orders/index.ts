import { timeSlotsService } from "@frontend-core/client/time-slots/time-slots.service";
import { paymentsService } from "@frontend-core/server/payments/payments-service";
import { NextApiRequest, NextApiResponse } from "next";

const createOrder = async (req: NextApiRequest, res: NextApiResponse) => {
  const { itemId, email } = req.body;

  try {
    await timeSlotsService.updateTimeSlot(itemId, { status: "RESERVED" });
    const { url, token } = await paymentsService.createPayment({
      itemId,
      description: "Venta sobrecupo de prueba",
      amount: 2990,
      email,
    });

    return res.status(201).json({ url: `${url}?token=${token}` });
  } catch (error) {
    console.error(error);
    return res.status(500).json({});
  }
};

export default createOrder;
