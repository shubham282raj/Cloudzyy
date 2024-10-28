import { validationResult } from "express-validator";

const customValidate = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessage = errors
      .array()
      .map((error) => `${error.msg}`)
      .join(", ");
    return res.status(400).send({ message: errorMessage });
  }

  next();
};

export { customValidate };
