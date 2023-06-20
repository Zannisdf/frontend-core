import { timeSlotsService } from "@frontend-core/client/time-slots/time-slots.service";
import { UserDoc, userService } from "@frontend-core/client/users/user.service";
import { NextApiRequest, NextApiResponse } from "next";

const DATA_BY_SPECIALTY_ID: Record<string, any> = {
  pediatria: {
    title: "Pediatría",
    seo: {
      title: "Pediatría | Sobrecupos",
      description: "",
    },
  },
  otorrino: {
    title: "Otorrinolaringología",
    seo: {
      title: "Otorrinolaringología | Sobrecupos",
      description: "",
    },
  },
  oftalmologia: {
    title: "Oftalmología",
    seo: {
      title: "Oftalmología | Sobrecupos",
      description: "",
    },
  },
  traumatologia: {
    title: "Traumatología",
    seo: {
      title: "Traumatología | Sobrecupos",
      description: "",
    },
  },
  "medicina-general": {
    title: "Medicina general",
    seo: {
      title: "Medicina general | Sobrecupos",
      description: "",
    },
  },
  neurologia: {
    title: "Neurología",
    seo: {
      title: "Neurología | Sobrecupos",
      description: "",
    },
  },
  cirugia: {
    title: "Cirugía",
    seo: {
      title: "Cirugía | Sobrecupos",
      description: "",
    },
  },
  "inmunologia-y-alergias": {
    title: "Inmunología y alergias",
    seo: {
      title: "Inmunología y alergias | Sobrecupos",
      description: "",
    },
  },
};

const getViewData = (user: UserDoc) => {
  return {
    name: `${user.names} ${user.surnames}`,
    specialty: DATA_BY_SPECIALTY_ID[user.specialty].title,
    picture: user.picture,
    insuranceProviders: ["Isapre", "Fonasa", "Particular"],
    licenseId: user.licenseId,
    description: user.description,
  };
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const practitionerCode = req.query["practitionerCode"] as string;

  try {
    const user = await userService.getPractitionerByCode(practitionerCode);
    return res.status(200).json(getViewData(user));
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({ error });
  }
};
