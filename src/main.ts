import { getAccount } from "./getAccount";
import { signup } from "./signup";

const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/accounts/:accountId', async(req: any, res: any) => {
  const account = await getAccount(req.params);
  res.json(account);
});

app.post('/accounts', async (req: any, res: any) => {
  const account = await signup(req.body);
  res.json(account);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
