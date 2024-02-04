import GetAccount from "./GetAccount";
import Signup from "./Signup";
import AccountDAODatabase from '../src/AccountDAODatabase';

const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/accounts/:accountId', async(req: any, res: any) => {
  const getAccount = new GetAccount(new AccountDAODatabase());
  const output = await getAccount.execute(req.params.accountId);
  res.json(output);
});

app.post('/accounts', async (req: any, res: any) => {
  try {
    const signup = new Signup(new AccountDAODatabase());
    const output = await signup.execute(req.body);
    res.json(output);
  } catch (err: any) {
    if (err instanceof Error) {
      return res.status(422).json({ message: err.message });
    } else {
      return res.status(500).json({ message: 'internal error' });
    }
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
