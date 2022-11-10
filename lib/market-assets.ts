import { getJsonFile, uploadJsonFile } from "./s3";

const fs = require("fs");

export async function updateCards() {
  const me = { name: "Dante", dog: "cat" };
  if (me) {
    uploadJsonFile(me, "test", "card");
    return true;
  }
  return false;
}
