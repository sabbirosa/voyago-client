export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  es: "Español",
};

export const translations = {
  en: {
    common: {
      welcome: "Welcome",
      explore: "Explore",
      book: "Book Now",
      view: "View",
      cancel: "Cancel",
      save: "Save",
      delete: "Delete",
      edit: "Edit",
      loading: "Loading...",
      error: "Error",
      success: "Success",
    },
    nav: {
      home: "Home",
      explore: "Explore",
      dashboard: "Dashboard",
      profile: "Profile",
      login: "Log in",
      register: "Sign up",
      logout: "Log out",
    },
    dashboard: {
      title: "Dashboard",
      upcomingTrips: "Upcoming Trips",
      pastTrips: "Past Trips",
      wishlist: "Wishlist",
    },
  },
  es: {
    common: {
      welcome: "Bienvenido",
      explore: "Explorar",
      book: "Reservar Ahora",
      view: "Ver",
      cancel: "Cancelar",
      save: "Guardar",
      delete: "Eliminar",
      edit: "Editar",
      loading: "Cargando...",
      error: "Error",
      success: "Éxito",
    },
    nav: {
      home: "Inicio",
      explore: "Explorar",
      dashboard: "Panel",
      profile: "Perfil",
      login: "Iniciar sesión",
      register: "Registrarse",
      logout: "Cerrar sesión",
    },
    dashboard: {
      title: "Panel",
      upcomingTrips: "Viajes Próximos",
      pastTrips: "Viajes Pasados",
      wishlist: "Lista de deseos",
    },
  },
} as const;

export function getTranslations(locale: Locale) {
  return translations[locale] || translations[defaultLocale];
}

