import pgp from "pg-promise";
import Signup from '../src/Signup';
import AccountDAODatabase from '../src/AccountDAODatabase';
import RideDAODatabase from '../src/RideDAODatabase';
import RequestRide from '../src/RequestRide';
import GetRide from '../src/GetRide';

const accountDAO = new AccountDAODatabase();
const rideDAO = new RideDAODatabase();
const signup = new Signup(accountDAO);
const requestRide = new RequestRide(accountDAO, rideDAO);
const getRide = new GetRide(rideDAO);

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
  const input = {
    passengerId: account.accountId,
    fromLat: 25,
    fromLong: 25,
    toLat: 50,
    toLong: 50
	};
  const requestResult = await requestRide.execute(input);
  expect(requestResult.rideId).toBeDefined();
  const ride = await getRide.execute(requestResult.rideId);
  expect(ride.ride_id).toBe(requestResult.rideId)
  expect(ride.passenger_id).toBe(account.accountId);
  expect(parseInt(ride.from_lat)).toBe(input.fromLat);
  expect(parseInt(ride.from_long)).toBe(input.fromLong);
  expect(parseInt(ride.to_lat)).toBe(input.toLat);
  expect(parseInt(ride.to_long)).toBe(input.toLong);
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
