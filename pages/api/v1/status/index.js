import { createRouter } from "next-connect";
import database from "infra/database.js";
import controller from "infra/controller";
const router = createRouter();

router.get(getHandler);

export default router.handler(controller.errorHandlers);

async function getHandler(request, response) {
  const updatedAt = new Date().toISOString();
  const resultServerVersion = await database.query("SHOW server_version;");
  const postgresVersion = resultServerVersion.rows[0].server_version;
  const resultMaxConnections = await database.query("SHOW max_connections;");
  const maxConnections = resultMaxConnections.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DATABASE;
  const resultMaxUsedConnections = await database.query({
    text: "SELECT count(*)::int FROM pg_stat_activity WHERE datname = $1",
    values: [databaseName],
  });

  const maxUsedConnections = resultMaxUsedConnections.rows[0].count;
  return response.status(200).json({
    updated_at: updatedAt,
    database: {
      postgres_version: postgresVersion,
      max_connections: Number(maxConnections),
      max_used_connections: maxUsedConnections,
    },
  });
}
