import { ordersClient } from "@frontend-core/server/orders";
import { NextApiRequest, NextApiResponse } from "next";

export const config = {
  runtime: 'edge'
}

const getOrderStatus = async (req: NextApiRequest, res: NextApiResponse) => {
  const { itemId } = req.query;

  if (typeof itemId !== "string") {
    return res.status(404).json({ notFound: true });
  }

  const order = await ordersClient.get(itemId);

  if (!order) {
    return res.status(500).json({ error: true });
  }

  return res.status(200).json({
    date: order.start,
    intervalInMinutes: order.intervalInMinutes,
    practitionerName: order.practitionerName,
    practiceAddress: order.practiceAddress,
  });
};

export default getOrderStatus;
