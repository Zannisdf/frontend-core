import { UserDoc, userService } from "@frontend-core/client/users/user.service";
import { NextApiRequest, NextApiResponse } from "next";

const DATA_BY_SPECIALTY_ID: Record<string, any> = {
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

const getViewData = (user: UserDoc) => {
  return {
    seo: {
      ...DATA_BY_SPECIALTY_ID[user.specialty].seo,
      description: user.description,
      noIndex: !!user.hidden,
    },
    profile: {
      name: `${user.names} ${user.surnames}`,
      specialty: DATA_BY_SPECIALTY_ID[user.specialty].title,
      picture: user.picture,
      licenseId: user.licenseId,
      description: user.description,
    },
  };
};

export const config = {
  runtime: 'edge'
}

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
