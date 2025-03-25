import type { Config } from "tailwindcss"
import tailwindcssAnimate from "tailwindcss-animate"

const config = {
  darkMode: ["class", "[data-theme='dark']"],
  content: ["./src/**/*.tsx", "../../packages/*/src/**/*.tsx"],
  plugins: [tailwindcssAnimate]
} satisfies Config

export default config
