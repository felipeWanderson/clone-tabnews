test("GET to /api/v1/status should return status 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  const responseBody = await response.json();
  expect(response.status).toBe(200);

  const parsedUpadatedAt = new Date(responseBody.updated_at).toISOString();

  expect(responseBody.updated_at).toEqual(parsedUpadatedAt);

  expect(responseBody.database.postgres_version).toEqual("16.0");
  expect(responseBody.database.max_connections).toEqual(100);
  expect(responseBody.database.max_used_connections).toEqual(1);
});
