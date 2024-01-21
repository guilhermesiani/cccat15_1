import axios from "axios";
import pgp from "pg-promise";

afterEach(async () => {
	const connection = pgp()("postgres://admin:root@localhost:5432/test_db");
  await connection.query('delete from account');
  await connection.$pool.end();
})

test("Create a valid driver account", async function () {
	const createResponse = await axios.post("http://localhost:3000/accounts", {
    name: "Guilherme Siani",
    email: "user@domain.com",
    cpf: "012.051.530-04",
    isDriver: true,
    isPassenger: false,
    carPlate: "ASD9456"
	});
  expect(createResponse.status).toBe(200);
  expect(createResponse.data.accountId).toBeDefined();
  const response = await axios.get(`http://localhost:3000/accounts/${createResponse.data.accountId}`);
  expect(response.data).toEqual({
    account_id: createResponse.data.accountId,
    car_plate: "ASD9456",
    cpf: "012.051.530-04",
    email: "user@domain.com",
    is_driver: true,
    is_passenger: false,
    name: "Guilherme Siani"
  });
});

test("Create a valid passenger account", async function () {
	const createResponse = await axios.post("http://localhost:3000/accounts", {
    name: "Guilherme Siani",
    email: "user@domain.com",
    cpf: "012.051.530-04",
    isDriver: false,
    isPassenger: true,
	});
  expect(createResponse.status).toBe(200);
  expect(createResponse.data.accountId).toBeDefined();
  const response = await axios.get(`http://localhost:3000/accounts/${createResponse.data.accountId}`);
  expect(response.data).toEqual({
    account_id: createResponse.data.accountId,
    car_plate: null,
    cpf: "012.051.530-04",
    email: "user@domain.com",
    is_driver: false,
    is_passenger: true,
    name: "Guilherme Siani"
  });
});

test("Create duplicated email account should return error", async function () {
	await axios.post("http://localhost:3000/accounts", {
    name: "Guilherme Siani",
    email: "user@domain.com",
    cpf: "012.051.530-04",
    isDriver: true,
    carPlate: "ASD9456"
	});
	const createResponse = await axios.post("http://localhost:3000/accounts", {
    name: "Carlos Camargo",
    email: "user@domain.com",
    cpf: "012.051.530-05",
    isDriver: true,
    carPlate: "ASD9456"
	});
  expect(createResponse.status).toBe(200);
  expect(createResponse.data).toBe(-4);
});

test("Create account with invalid car plate should return error", async function () {
	const createResponse = await axios.post("http://localhost:3000/accounts", {
    name: "Guilherme Siani",
    email: "user@domain.com",
    cpf: "012.051.530-04",
    isDriver: true,
    carPlate: "XXXX"
	});
  expect(createResponse.status).toBe(200);
  expect(createResponse.data).toBe(-5);
});

test("Create account with invalid name should return error", async function () {
	const createResponse = await axios.post("http://localhost:3000/accounts", {
    name: "INVALID",
    email: "user@domain.com",
    cpf: "012.051.530-04",
    isDriver: true,
    carPlate: "ASD9456"
	});
  expect(createResponse.status).toBe(200);
  expect(createResponse.data).toBe(-3);
});

test("Create account with invalid email should return error", async function () {
	const createResponse = await axios.post("http://localhost:3000/accounts", {
    name: "Guilherme Siani",
    email: "INVALID",
    cpf: "012.051.530-04",
    isDriver: true,
    carPlate: "ASD9456"
	});
  expect(createResponse.status).toBe(200);
  expect(createResponse.data).toBe(-2);
});

test("Create account with invalid cpf should return error", async function () {
	const createResponse = await axios.post("http://localhost:3000/accounts", {
    name: "Guilherme Siani",
    email: "user@domain.com",
    cpf: "INVALID",
    isDriver: true,
    carPlate: "ASD9456"
	});
  expect(createResponse.status).toBe(200);
  expect(createResponse.data).toBe(-1);
});
