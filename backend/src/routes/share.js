import { Router } from "express";

const share = Router();

const dataStore = {};

function generateUniqueKey() {
  let key;
  do {
    key = Math.floor(1000 + Math.random() * 9000).toString();
  } while (dataStore[key]);
  return key;
}

share.post("/", async (req, res) => {
  try {
    const data = req.body.data;

    const key = generateUniqueKey();
    dataStore[key] = data;

    setTimeout(() => {
      delete dataStore[key];
      console.log("Deleted key", key);
    }, 2 * 60 * 1000);

    return res.status(200).send({
      message: "Data received",
      key: key,
    });
  } catch (error) {
    return res.status(500).send({
      message: "Something went wrong",
    });
  }
});

share.get("/:key", async (req, res) => {
  try {
    const key = req.params.key;
    const data = dataStore[key];

    if (data) {
      return res.status(200).send({
        data: data,
      });
    } else {
      return res.status(404).send({
        message: "Data not found or has expired",
      });
    }
  } catch (error) {
    return res.status(500).send({
      message: "Something went wrong",
    });
  }
});

export default share;
