import { paymentsService } from "@frontend-core/server/payments/payments-service";
import { NextApiRequest, NextApiResponse } from "next";

const statusById = new Map([
  [1, "PENDING"],
  [2, "PAID"],
  [3, "REJECTED"],
  [4, "CANCELED"],
]);

const getPayment = async (req: NextApiRequest, res: NextApiResponse) => {
  const { paymentId } = JSON.parse(req.body);

  try {
    const payment = await paymentsService.getPaymentStatus(paymentId);
    const amount = new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(payment.amount);

    return res.status(200).json({
      itemId: payment.commerceOrder,
      amount,
      status: statusById.get(payment.status),
      paymentMethod: "Flow",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: true });
  }
};

export default getPayment;
