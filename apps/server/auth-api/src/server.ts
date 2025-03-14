import express from "express";
import cors from "cors";
import { signInHandler } from "@robust-monorepo-yarn-nx-changesets/sign-in-handler";

const app = express();
const port = process.env.PORT || 1234;

app.use(express.json());

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
  })
);

app.post("/auth/signIn", signInHandler);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
