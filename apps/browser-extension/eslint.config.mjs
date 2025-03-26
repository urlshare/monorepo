import { config } from "@workspace/eslint-config/react-internal"

/** @type {import("eslint").Linter.Config} */

const combinedConfig = [...config, { ignores: [".wxt/", ".output/"] }]

export default combinedConfig
