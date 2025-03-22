// /** @type {import('tailwindcss').Config} */
// module.exports = {
//   content: ["./popup.tsx", "./popup-component/**/*.tsx", "../../packages/*/src/**/*.tsx"],
//   darkMode: ["class", "[data-theme='dark']"],
//   mode: "jit",
//   plugins: [require("tailwindcss-animate")]
// }

import type { Config } from "tailwindcss"
import tailwindcssAnimate from "tailwindcss-animate"

// import { fontFamily } from "tailwindcss/defaultTheme";

const config = {
  darkMode: ["class", "[data-theme='dark']"],
  content: ["./popup.tsx", "./popup-component/**/*.tsx", "../../packages/*/src/**/*.tsx"],
  // theme: {
  //   extend: {
  //     fontFamily: {
  //       sans: ["var(--font-sans)", ...fontFamily.sans],
  //       mono: ["var(--font-mono)", ...fontFamily.mono],
  //     },
  //   },
  // },
  plugins: [tailwindcssAnimate]
} satisfies Config

export default config
