import axios from "axios";
import pgp from "pg-promise";

afterEach(async () => {
	const connection = pgp()("postgres://admin:root@localhost:5432/test_db");
  await connection.query('delete from account');
  await connection.$pool.end();
})

test("Create an account", async function () {
	const createResponse = await axios.post("http://localhost:3000/accounts", {
    name: "Guilherme Siani",
    email: "user@domain.com",
    cpf: "012.051.530-04",
    isDriver: true,
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
