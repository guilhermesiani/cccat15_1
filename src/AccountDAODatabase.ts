import pgp from "pg-promise"
import crypto from "crypto";
import AccountDAO from "./AccountDAO"

export default class AccountDAODatabase implements AccountDAO {
  async getById(accountId: string): Promise<any> {
    const connection = pgp()("postgres://admin:root@localhost:5432/test_db");
    try {
      const result = await connection.query("select * from account where account_id = $1", [accountId])
      return result.length > 0 ? result[0] : null;
    } finally {
      await connection.$pool.end();
    }
  }

  async getByEmail(email: string): Promise<any> {
    const connection = pgp()("postgres://admin:root@localhost:5432/test_db");
    try {
      const [account] = await connection.query("select * from account where email = $1", [email]);
      return account;
    } finally {
      await connection.$pool.end();
    }
  }

  async save(input: any): Promise<void> {
    const connection = pgp()("postgres://admin:root@localhost:5432/test_db");
    try {
      await connection.query("insert into account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)", [input.accountId, input.name, input.email, input.cpf, input.carPlate, !!input.isPassenger, !!input.isDriver]);
    } finally {
      await connection.$pool.end();
    }
  }
}
