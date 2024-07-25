const { DATABASE_USERNAME, DATABASE_PASSWORD, DATABASE_HOST, DATABASE_PORT, DATABASE_NAME } =
  process.env;

if (
  !DATABASE_USERNAME ||
  !DATABASE_PASSWORD ||
  !DATABASE_HOST ||
  !DATABASE_PORT ||
  !DATABASE_NAME
) {
  console.error('One or more required environment variables are missing');
  process.exit(1);
}

const databaseUrl = `postgresql://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}`;

process.env.DATABASE_URL = databaseUrl;
