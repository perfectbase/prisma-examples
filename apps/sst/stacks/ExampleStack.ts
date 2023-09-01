import path from "path";
import fs from "fs-extra";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Api, StackContext } from "sst/constructs";

function preparePrismaLayerFiles() {
  const layerPath = "./layers/prisma";
  fs.rmSync(layerPath, { force: true, recursive: true });
  fs.mkdirSync(layerPath, { recursive: true });
  const modulesPath = "../../node_modules";
  const files = [".prisma", "@prisma/client", "prisma/build"];
  for (const file of files) {
    const from = path.join(modulesPath, file);
    const to = path.join(layerPath, "nodejs/node_modules", file);
    // Do not include binary files that aren't for AWS to save space
    fs.copySync(from, to, {
      filter: (src) => !src.endsWith("so.node") || src.includes("rhel"),
    });
  }
}

export function ExampleStack({ stack }: StackContext) {
  preparePrismaLayerFiles();
  const PrismaLayer = new lambda.LayerVersion(stack, "PrismaLayer", {
    description: "Prisma layer",
    code: lambda.Code.fromAsset("./layers/prisma"),
  });

  const api = new Api(stack, "Api", {
    defaults: {
      function: {
        runtime: "nodejs18.x",
        environment: {
          DATABASE_URL: process.env.DATABASE_URL!,
        },
        nodejs: {
          esbuild: {
            external: ["@prisma/client", ".prisma"],
          },
        },
        layers: [PrismaLayer],
      },
    },
    routes: {
      "GET /post": "packages/functions/src/index.handler",
    },
  });

  stack.addOutputs({
    api: api.url,
  });
}
