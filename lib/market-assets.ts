import { getJsonFile, uploadJsonFile } from "./s3";

const fs = require("fs");

export async function updateCards() {
  const me = { name: "Dante", dog: "cat" };
  uploadJsonFile(me, "test", "card");
}
