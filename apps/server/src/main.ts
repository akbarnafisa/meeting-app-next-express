import express from "express";
import cors from "cors";

const app = express();
const port = process.env.SERVER_PORT || 4000;

console.log({
  process: process.env,
});

app.use(express.json());
app.use(cors());

app.get("/", (_, res) => res.send({ status: `hello world` }));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
