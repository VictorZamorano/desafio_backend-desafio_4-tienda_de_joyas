import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
	allowExitOnIdle: true,
});
