export const availableRoutes = {
  profile: { path: "/perfil", label: "Perfil" },
  timeSlots: { path: "/sobrecupos", label: "Sobrecupos" },
  login: { path: "/login", label: "Iniciar Sesión" },
} as const;

export const protectedRoutes = [
  availableRoutes.profile,
  availableRoutes.timeSlots,
];
