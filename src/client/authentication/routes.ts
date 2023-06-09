export const availableRoutes = {
  profile: { path: "/perfil", label: "Perfil" },
  timeSlots: { path: "/sobrecupos", label: "Sobrecupos" },
  waitingActivation: { path: "/verificacion", label: "Verificación de cuenta" },
  login: { path: "/login", label: "Iniciar Sesión" },
  activateUser: { path: "/activar-usuario", label: "Activar" },
  users: { path: "/usuarios", label: "Usuarios" },
  index: { path: "/", label: "Inicio" },
} as const;

export const protectedRoutes = [
  availableRoutes.profile,
  availableRoutes.timeSlots,
  availableRoutes.waitingActivation,
  availableRoutes.index,
];

export const signedInNavbarRoutes = [availableRoutes.timeSlots];

export const superUserNavbarRoutes = [
  availableRoutes.activateUser,
  availableRoutes.users,
];
