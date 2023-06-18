import { paymentsService } from "@frontend-core/server/payments/payments-service";
import { NextApiRequest, NextApiResponse } from "next";

const getPayment = async (req: NextApiRequest, res: NextApiResponse) => {
  const { token } = req.body;

  console.log('context', req.body);

  try {
    const { itemId } = await paymentsService.getPaymentStatus(token);

    return res.status(200).json({
      itemId,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: true });
  }
};

export default getPayment;
