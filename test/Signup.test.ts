import pgp from "pg-promise";
import Signup from '../src/Signup';
import GetAccount from '../src/GetAccount';
import AccountDAODatabase from '../src/AccountDAODatabase';

const accountDAO = new AccountDAODatabase();
const signup = new Signup(accountDAO);
const getAccount = new GetAccount(accountDAO);

afterEach(async () => {
	const connection = pgp()("postgres://admin:root@localhost:5432/test_db");
  await connection.query('delete from account');
  await connection.$pool.end();
});

test("Create a valid driver account", async function () {
  const result = await signup.execute({
    name: "Guilherme Siani",
    email: "user@domain.com",
    cpf: "012.051.530-04",
    isDriver: true,
    isPassenger: false,
    carPlate: "ASD9456"
	});
  expect(result.accountId).toBeDefined();
  const account = await getAccount.execute(result.accountId);
  expect(account).toEqual({
    account_id: result.accountId,
    car_plate: "ASD9456",
    cpf: "012.051.530-04",
    email: "user@domain.com",
    is_driver: true,
    is_passenger: false,
    name: "Guilherme Siani"
  });
});

test("Create a valid passenger account", async function () {
  const result = await signup.execute({
    name: "Guilherme Siani",
    email: "user@domain.com",
    cpf: "012.051.530-04",
    isDriver: false,
    isPassenger: true,
	});
  expect(result.accountId).toBeDefined();
  const account = await getAccount.execute(result.accountId);
  expect(account).toEqual({
    account_id: result.accountId,
    car_plate: null,
    cpf: "012.051.530-04",
    email: "user@domain.com",
    is_driver: false,
    is_passenger: true,
    name: "Guilherme Siani"
  });
});

test("Create duplicated email account should return error", async function () {
  await signup.execute({
    name: "Guilherme Siani",
    email: "user@domain.com",
    cpf: "012.051.530-04",
    isDriver: true,
    carPlate: "ASD9456"
	});
  const input = {
    name: "Carlos Camargo",
    email: "user@domain.com",
    cpf: "012.051.530-04",
    isDriver: true,
    carPlate: "ASD9456"
	};
  await expect(() => signup.execute(input)).rejects.toThrow(new Error("email already exists"));
});

test("Create account with invalid car plate should return error", async function () {
  const input = {
    name: "Guilherme Siani",
    email: "user@domain.com",
    cpf: "012.051.530-04",
    isDriver: true,
    carPlate: "XXXX"
	};
  await expect(() => signup.execute(input)).rejects.toThrow(new Error("invalid car plate"));
});

test("Create account with invalid name should return error", async function () {
  const input = {
    name: "INVALID",
    email: "user@domain.com",
    cpf: "012.051.530-04",
    isDriver: true,
    carPlate: "ASD9456"
	};
  await expect(() => signup.execute(input)).rejects.toThrow(new Error("invalid name"));
});

test("Create account with invalid email should return error", async function () {
  const input = {
    name: "Guilherme Siani",
    email: "INVALID",
    cpf: "012.051.530-04",
    isDriver: true,
    carPlate: "ASD9456"
	};
  await expect(() => signup.execute(input)).rejects.toThrow(new Error("invalid email"));
});

test("Create account with invalid cpf should return error", async function () {
  const input = {
    name: "Guilherme Siani",
    email: "user@domain.com",
    cpf: "INVALID",
    isDriver: true,
    carPlate: "ASD9456"
	};
  await expect(() => signup.execute(input)).rejects.toThrow(new Error("invalid cpf"));
});
