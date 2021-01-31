export default () => ({
  database: {
    user: process.env.DB_USER_NAME,
    password: process.env.DB_PASSWORD,
    db_name: process.env.DB_NAME,
    mongo_uri: process.env.MONGO_URI,
  },
});
