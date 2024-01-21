import crypto from "crypto";
import pgp from "pg-promise";
import { validateCpf } from "./validateCpf";

export async function signup (input: any): Promise<any> {
  const connection = pgp()("postgres://admin:root@localhost:5432/test_db");
	try {
		const id = crypto.randomUUID();
    if (invalidEmail(input.email)) return -2;
		if (await alreadyExists(connection, input.email)) return -4;
    if (invalidName(input.name)) return -3;
    if (invalidCPF(input.cpf)) return -1;
    if (!input.isDriver) {
      return await createPassenger(connection, id, input);
    }
    return await createDriver(connection, id, input);
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
  return !carPlate.match(/[A-Z]{3}[0-9]{4}/);
}

async function alreadyExists(connection: any, email: string) {
  const [alreadyExists] = await connection.query("select * from account where email = $1", [email]);
  return alreadyExists;
}

async function createPassenger(connection: any, id: any, input: any) {
  await connection.query("insert into account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)", [id, input.name, input.email, input.cpf, input.carPlate, !!input.isPassenger, !!input.isDriver]);
  const obj = {
    accountId: id
  };
  return obj;
}

async function createDriver(connection: any, id: any, input: any) {
  if (invalidCarPlate(input.carPlate)) return -5;
  await connection.query("insert into account (account_id, name, email, cpf, car_plate, is_passenger, is_driver) values ($1, $2, $3, $4, $5, $6, $7)", [id, input.name, input.email, input.cpf, input.carPlate, !!input.isPassenger, !!input.isDriver]);
  
  const obj = {
    accountId: id
  };
  return obj;
}
