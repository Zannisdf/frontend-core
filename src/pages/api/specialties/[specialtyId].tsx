import { UserDoc, userService } from "@frontend-core/client/users/user.service";
import { NextApiRequest, NextApiResponse } from "next";

export const DATA_BY_SPECIALTY_ID: Record<string, any> = {
  pediatria: {
    title: "Pediatría",
    seo: {
      title: "Pediatría | Sobrecupos",
      description:
        "Médicos pediatras altamente capacitados y motivados que ofrecen atención especializada para el cuidado y bienestar de tus hijos.",
    },
  },
  otorrino: {
    title: "Otorrinolaringología",
    seo: {
      title: "Otorrinolaringología | Sobrecupos",
      description:
        "Otorrinos que brindan atención de calidad para el diagnóstico y tratamiento de trastornos relacionados con el oído, la nariz y la garganta",
    },
  },
  oftalmologia: {
    title: "Oftalmología",
    seo: {
      title: "Oftalmología | Sobrecupos",
      description:
        "Especialistas en oftalmología en Sobrecupos. Soluciones personalizadas para tus ojos, miopía, astigmatismo, cataratas y más. Mejora la calidad de tu visión.",
    },
  },
  traumatologia: {
    title: "Traumatología",
    seo: {
      title: "Traumatología | Sobrecupos",
      description:
        "Traumatólogos que ofrecen atención integral para el diagnóstico, tratamiento y rehabilitación de lesiones y trastornos musculoesqueléticos.",
    },
  },
  "medicina-general": {
    title: "Medicina general",
    seo: {
      title: "Medicina general | Sobrecupos",
      description:
        "Encuentra sobrecupos con médicos generales expertos en diagnóstico y tratamiento de enfermedades comunes y crónicas. ¡Mejora tu bienestar y calidad de vida!",
    },
  },
  neurologia: {
    title: "Neurología",
    seo: {
      title: "Neurología | Sobrecupos",
      description:
        "Neurólogos capacitados en el diagnósticos y tratamiento de enfermedades como el Alzheimer, el Parkinson y otros trastornos neurológicos.",
    },
  },
  cirugia: {
    title: "Cirugía",
    seo: {
      title: "Cirugía | Sobrecupos",
      description:
        "Descubre nuestros cirujanos especializados en procedimientos de vanguardia. Atención de calidad para transformar tu bienestar con resultados excepcionales.",
    },
  },
  "inmunologia-y-alergias": {
    title: "Inmunología y alergias",
    seo: {
      title: "Inmunología y alergias | Sobrecupos",
      description:
        "Descubre a los mejores profesionales en enfermedades del sistema inmunológico. Atención de calidad para fortalecer tu salud. ¡Mejora tu bienestar ahora!",
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

export const config = {
  runtime: 'edge'
}

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
