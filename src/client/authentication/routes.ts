export const availableRoutes = {
  profile: { path: "/perfil", label: "Perfil" },
  timeSlots: { path: "/sobrecupos", label: "Sobrecupos" },
  waitingActivation: { path: "/verificacion", label: "Verificación de cuenta" },
  login: { path: "/login", label: "Iniciar Sesión" },
} as const;

export const protectedRoutes = [
  availableRoutes.profile,
  availableRoutes.timeSlots,
  availableRoutes.waitingActivation
];

export const signedInNavbarRoutes = [
  availableRoutes.timeSlots,
]