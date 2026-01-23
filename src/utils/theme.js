// src/utils/theme.js
export const applyTheme = () => {
  const isDark = localStorage.getItem("darkMode") === "true";
  if (isDark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  return isDark;
};

export const toggleTheme = () => {
  const current = localStorage.getItem("darkMode") === "true";
  const next = !current;
  localStorage.setItem("darkMode", next);
  applyTheme();
  return next;
};