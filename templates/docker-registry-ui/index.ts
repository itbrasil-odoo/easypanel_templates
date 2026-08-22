import { Output, Services } from "~templates-utils";
import { Input } from "./meta";

export function generate(input: Input): Output {
  const services: Services = [];

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
      serviceName: input.frontendServiceName,
      source: {
        type: "image",
        image: input.frontendServiceImage,
      },
      env: [
        `SINGLE_REGISTRY=true`,
        `REGISTRY_TITLE=${input.appServiceName}`,
        `DELETE_IMAGE=true`,
        `SHOW_CONTENT_DIGES=true`,
        `NGINX_PROXY_PASS_URL=http://${input.appServiceName}:5000`,
        `SHOW_CATALOG_NB_TAGS=true`,
        `CATALOG_MIN_BRANCHE=1`,
        `CATALOG_MAX_BRANCHES=2`,
        `TAGLIST_PAGE_SIZE=100`,
        `REGISTRY_SECURE=true`,
        `CATALOG_ELEMENTS_LIMIT=1000`,
        `REGISTRY_URL=http://${input.appServiceName}:5000`,
        `REGISTRY_NAME=${input.appServiceName}`,
      ].join("\n"),
      domains: [
        {
          host: "$(EASYPANEL_DOMAIN)",
          port: 80,
        },
      ],
      mounts: [
        { type: "volume", name: "data", mountPath: "/var/lib/registry" },
      ],
      deploy: {
        zeroDowntime: true,
      },
    },
  });

  return { services };
}
