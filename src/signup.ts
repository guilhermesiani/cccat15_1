import crypto from "crypto";
import pgp from "pg-promise";
import { validateCpf } from "./validateCpf";

export async function signup (input: any): Promise<any> {
  const connection = pgp()("postgres://admin:root@localhost:5432/test_db");
  const id = crypto.randomUUID();
  if (invalidEmail(input.email)) return -2;
  if (invalidName(input.name)) return -3;
  if (invalidCPF(input.cpf)) return -1;
  if (invalidCarPlate(input.carPlate)) return -5;
	try {
		if (await duplicatedEmail(connection, input.email)) return -4;
    return await saveAccount(connection, id, input);
	} finally {
		await connection.$pool.end();
	}
}

function invalidName(name: string) {
  return !name.match(/[a-zA-Z] [a-zA-Z]+/);
}

function invalidEmail(email: string) {
  return !email.match(/^(.+)@(.+)$/);
}

function invalidCPF(cpf: string) {
  return !validateCpf(cpf);
}

function invalidCarPlate(carPlate: string) {
  return carPlate && !carPlate.match(/[A-Z]{3}[0-9]{4}/);
}

async function duplicatedEmail(connection: any, email: string) {
  const [duplicatedEmail] = await connection.query("select * from account where email = $1", [email]);
  return duplicatedEmail;
}

async function saveAccount(connection: any, id: any, input: any) {
  await connection.query("insert into account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)", [id, input.name, input.email, input.cpf, input.carPlate, !!input.isPassenger, !!input.isDriver]);
  const obj = {
    accountId: id
  };
  return obj;
}
