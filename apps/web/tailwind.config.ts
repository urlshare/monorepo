import config from "@workspace/ui/tailwind.config";

const customConfig = {
  ...config,
  content: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}", "modules/**/*.{ts,tsx}", ...config.content],
};

export default customConfig;
