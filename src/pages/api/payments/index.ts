import { paymentsService } from "@frontend-core/server/payments/payments-service";
import { NextApiRequest, NextApiResponse } from "next";

const getPayment = async (req: NextApiRequest, res: NextApiResponse) => {
  const { token } = JSON.parse(req.body);

  try {
    const { commerceOrder } = await paymentsService.getPaymentStatus(token);

    return res.status(200).json({
      itemId: commerceOrder,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: true });
  }
};

export default getPayment;
