import { UserDoc, userService } from "@frontend-core/client/users/user.service";
import { NextApiRequest, NextApiResponse } from "next";

export const DATA_BY_SPECIALTY_ID: Record<string, any> = {
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

const getViewData = (specialtyId: string, users: UserDoc[]) => {
  const specialtyData = DATA_BY_SPECIALTY_ID[specialtyId];

  return {
    ...specialtyData,
    practitioners: users.map(
      ({ picture, names, surnames, code, addressTags, specialty }) => ({
        picture,
        name: `${names} ${surnames}`,
        code,
        addressTags,
        specialty: specialtyData.title,
      })
    ),
  };
};

export default (req: NextApiRequest, res: NextApiResponse) => {
  const specialtyId = req.query["specialtyId"] as string;

  return userService
    .getPractitionersBySpecialty(specialtyId)
    .then((data) => getViewData(specialtyId, data))
    .then((data) => res.status(200).json(data))
    .catch((error) => {
      console.log(error.message);
      return res.status(500).json({});
    });
};
