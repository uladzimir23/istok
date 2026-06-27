import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

// ESLint 9 flat-config. eslint-config-next 16 экспортирует готовые flat-массивы
// (core-web-vitals + typescript) — подключаем напрямую, без FlatCompat.
const eslintConfig = [
  { ignores: [".next/**", "out/**", "node_modules/**", "next-env.d.ts"] },
  ...nextCoreWebVitals,
  ...nextTypescript,
];

export default eslintConfig;
