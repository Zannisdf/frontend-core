import { timeSlotsService } from "@frontend-core/client/time-slots/time-slots.service";
import { userService } from "@frontend-core/client/users/user.service";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const practitionerCode = req.query["practitionerCode"] as string;

  try {
    const user = await userService.getPractitionerByCode(practitionerCode);
    const insuranceProviders: Record<string, string> = {};
    user.practiceAddresses.forEach((address, index) => {
      insuranceProviders[address] = user.insuranceProviders?.[index] || "";
    });
    const timeSlots = await timeSlotsService.getPublicTimeSlots(
      user.userId,
      insuranceProviders
    );
    return res.status(200).json(timeSlots);
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({});
  }
};
