import { validateCpf } from "./validateCpf";

const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req: any, res: any) => {
  res.json({test: true});
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
