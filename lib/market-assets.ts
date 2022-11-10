import { getJsonFile, uploadJsonFile } from "./s3";

const fs = require("fs");

export async function updateCards() {
  const me = { name: "anna", dog: "true" };
  uploadJsonFile(me, "test", "cards-v2");
}
