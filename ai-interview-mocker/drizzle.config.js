/** @type { import ("drizzle-kit").Config } */
export default {
schema: "./utils/schema.js",
dialect: 'postgresql',
dbCredentials: {
url: 'postgresql://neondb_owner:npg_eDSxVaQ3C9BF@ep-crimson-bread-a4zisdsc-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require',
}
};