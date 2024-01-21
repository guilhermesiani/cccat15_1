import crypto from "crypto";
import pgp from "pg-promise";

export async function getAccount (input: any): Promise<any> {
	const connection = pgp()("postgres://admin:root@localhost:5432/test_db");
	try {
    const result = await connection.query("select * from account where account_id = $1", [input.accountId])
    return result.length > 0 ? result[0] : null;
	} finally {
		await connection.$pool.end();
	}
}
