import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />

      <h2>Banco de dados</h2>
      <DataBaseInfo />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let updatedAtText = "Carregando ...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return <div>Última atualização: {updatedAtText} </div>;
}

function DataBaseInfo() {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  const databaseInfoText = "Carregando ...";

  if (!isLoading && data) {
    return (
      <>
        <p>Versão do Postgres: {data.database.postgres_version}</p>
        <p>Máximo de Conexões: {data.database.max_connections}</p>
        <p>Máximo de Conexões Usadas: {data.database.max_used_connections}</p>
      </>
    );
  }

  return <div>{databaseInfoText}</div>;
}
