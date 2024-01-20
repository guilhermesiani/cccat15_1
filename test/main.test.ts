import axios from "axios";

test("Deve executar o checkin de um carro", async function () {
	const response = await axios({
		url: "http://localhost:3000",
		method: "get"
	});
	const data = response.data;
	expect(data.test).toBe(true);
});
