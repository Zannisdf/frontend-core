import { ordersClient } from "@frontend-core/server/orders";
import { paymentsService } from "@frontend-core/server/payments/payments-service";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { NextApiRequest, NextApiResponse } from "next";

const statusById = new Map([
  [1, "PENDING"],
  [2, "PAID"],
  [3, "REJECTED"],
  [4, "CANCELED"],
]);

const getOrderStatus = async (req: NextApiRequest, res: NextApiResponse) => {
  const { paymentId } = req.query;

  if (typeof paymentId !== "string") {
    return res.status(404).json({ notFound: true });
  }

  const [payment, order] = await Promise.all([
    paymentsService.getPaymentStatus(paymentId),
    ordersClient.get(paymentId),
  ]).catch((error) => {
    console.error(error);
    return [null, null];
  });

  if (!order || !payment) {
    return res.status(500).json({ error: true });
  }

  const amount = new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
  }).format(payment.amount);

  return res.status(200).json({
    date: order.start,
    intervalInMinutes: order.intervalInMinutes,
    practitionerName: order.practitionerName,
    practiceAddress: order.practiceAddress,
    paidAmount: amount,
    paymentMethod: "Flow",
    totalAmount: amount,
    status: statusById.get(payment.status),
  });
};

export default getOrderStatus;
