import { Output, randomPassword, Services } from "~templates-utils";
import { Input } from "./meta";

export function generate(input: Input): Output {
  const services: Services = [];
  const appPassword = randomPassword();

  services.push({
    type: "app",
    data: {
      projectName: input.projectName,
      serviceName: input.appServiceName,
      source: {
        type: "image",
        image: input.appServiceImage,
      },
      domains: [
        {
          host: "$(EASYPANEL_DOMAIN)",
          port: 5000,
        },
      ],
      env: [
        `REGISTRY_STORAGE_DELETE_ENABLED: 'true'`,
        `REGISTRY_HTTP_SECRET=${appPassword}`,
      ].join("\n"),
      mounts: [
        { type: "volume", name: "data", mountPath: "/var/lib/registry" },
      ],
      deploy: {
        zeroDowntime: true,
      },
      basicAuth: [{ username: input.user, password: input.password }],
    },
  });
  services.push({
    type: "app",
    data: {
      projectName: input.projectName,
      serviceName: input.appUiServiceName,
      source: {
        type: "image",
        image: input.appUiServiceImage,
      },
      domains: [
        {
          host: "$(EASYPANEL_DOMAIN)",
          port: 80,
        },
      ],
      env: [
        `REGISTRY_TITLE=${input.appUiServiceName}`,
        `NGINX_PROXY_PASS_URL=http://${input.appServiceName}:5000`,
        `SINGLE_REGISTRY=true`,
        `REGISTRY_SECURED=true`,
      ].join("\n"),
    },
  });

  return { services };
}
