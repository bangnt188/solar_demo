export function deploymentTarget(env: NodeJS.ProcessEnv = process.env): "demo" | "server" {
  const target = env.DEPLOY_TARGET || "demo";
  if (target !== "demo" && target !== "server") throw new Error("DEPLOY_TARGET must be demo or server");
  if (env.VERCEL_ENV === "production" && target !== "server") throw new Error("Vercel production requires DEPLOY_TARGET=server");
  return target;
}
