import pgp from "pg-promise";
import Signup from '../src/Signup';
import AccountDAODatabase from '../src/AccountDAODatabase';
import RideDAODatabase from '../src/RideDAODatabase';
import RequestRide from '../src/RequestRide';

const accountDAO = new AccountDAODatabase();
const rideDAO = new RideDAODatabase();
const signup = new Signup(accountDAO);
const requestRide = new RequestRide(accountDAO, rideDAO);

afterEach(async () => {
	const connection = pgp()("postgres://admin:root@localhost:5432/test_db");
  await connection.query('delete from account');
  await connection.query('delete from ride');
  await connection.$pool.end();
});

test("Request a ride", async function () {
  const account = await signup.execute({
    name: "Guilherme Siani",
    email: "user@domain.com",
    cpf: "012.051.530-04",
    isPassenger: true,
	});
  const result = await requestRide.execute({
    passengerId: account.accountId,
    fromLat: 25,
    fromLong: 25,
    toLat: 50,
    toLong: 50
	});
  expect(result.rideId).toBeDefined();
});

test("Should not request a ride if account is no passenger", async function () {
  const account = await signup.execute({
    name: "Guilherme Siani",
    email: "user@domain.com",
    cpf: "012.051.530-04",
    isPassenger: false,
	});
  await expect(() => requestRide.execute({
    passengerId: account.accountId,
    fromLat: 25,
    fromLong: 25,
    toLat: 50,
    toLong: 50
	})).rejects.toThrow(new Error("Account is not a passenger"));
});

test("Should not request a ride if another already exists", async function () {
  const account = await signup.execute({
    name: "Guilherme Siani",
    email: "user@domain.com",
    cpf: "012.051.530-04",
    isPassenger: true,
	});
  await requestRide.execute({
    passengerId: account.accountId,
    fromLat: 25,
    fromLong: 25,
    toLat: 50,
    toLong: 50
	});
  await expect(() => requestRide.execute({
    passengerId: account.accountId,
    fromLat: 25,
    fromLong: 25,
    toLat: 50,
    toLong: 50
	})).rejects.toThrow(new Error("There is a ride requested"));
});
