import type { RequestHandler } from "express";
import {
  passwordValidator,
  usernameValidator,
} from "@robust-monorepo-yarn-nx-changesets/validator";

const signInHandler: RequestHandler = (req, res) => {
  if (!req.body) {
    res.status(422).send("Request body is missing");
    return;
  }

  if (typeof req.body !== "object") {
    res.status(422).send("Request body expected to be an object");
    return;
  }

  const { username, password } = req.body;
  const usernameValidationResult = usernameValidator(username);
  if (typeof usernameValidationResult === "string") {
    res
      .status(422)
      .send("Invalid username format: " + usernameValidationResult);
    return;
  }

  const passwordValidationResult = passwordValidator(password);
  if (typeof passwordValidationResult === "string") {
    res
      .status(422)
      .send("Invalid password format: " + passwordValidationResult);
    return;
  }

  // Emulate a successful sign-in
  if (username === "test" && password === "test1234") {
    res.status(200).send("Sign in successful");
    return;
  }

  return res.status(422).send("Username or password is incorrect");
};

export default signInHandler;
