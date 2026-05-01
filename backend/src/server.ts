import { app } from "./app";
import { connectDb } from "./config/db";
import { env } from "./config/env";

const start = async (): Promise<void> => {
  await connectDb();
  app.listen(env.PORT, () => {
    console.log(`API running on port ${env.PORT}`);
    console.log(`Local: http://localhost:${env.PORT}`);
    console.log(`Health: http://localhost:${env.PORT}/health`);
  });
};

start().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
