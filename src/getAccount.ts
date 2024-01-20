import crypto from "crypto";
import pgp from "pg-promise";
import { validateCpf } from "./validateCpf";

export async function getAccount (input: any): Promise<any> {
	const connection = pgp()("postgres://admin:root@localhost:5432/test_db");
	try {
		const id = crypto.randomUUID();

		return await connection.query("select * from cccat15.account where account_id = $1", [input.account_id]);
	} finally {
		await connection.$pool.end();
	}
}
