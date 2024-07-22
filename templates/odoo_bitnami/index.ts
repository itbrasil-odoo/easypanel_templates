import { Output, randomPassword, Services } from "~templates-utils";
import { Input } from "./meta";

export function generate(input: Input): Output {
  const services: Services = [];
  const databasePassword = randomPassword();

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
          port: 8069,
        },
      ],
      env: [
        `ODOO_DATABASE_HOST=$(PROJECT_NAME)_${input.databaseServiceName}`,
        `ODOO_DATABASE_USER=odoo`,
        `ODOO_DATABASE_PASSWORD=${databasePassword}`,
        `ODOO_DATABASE_PORT_NUMBER=5432`,
      ].join("\n"),
      mounts: [
        {
          type: "volume",
          name: input.appServiceName + "-data",
          mountPath: "/bitnami/odoo",
        },
      ],
    },
  });
  services.push({
    type: "app",
    data: {
      projectName: input.projectName,
      serviceName: input.databaseServiceName,
      source: {
        type: "image",
        image: "bitnami/postgresql:latest",
      },
      env: [
        `POSTGRES_DB=postgres`,
        `POSTGRES_PASSWORD=${databasePassword}`,
        `POSTGRES_USER=odoo`,
      ].join("\n"),
      mounts: [
        {
          type: "volume",
          name: input.databaseServiceName + "-data",
          mountPath: "/bitnami/postgresql",
        },
      ],
    },
  });

  return { services };
}
