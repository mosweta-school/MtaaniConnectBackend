import fs from "fs";
import path from "path";

const DB_PATH = path.resolve("db.json");

// READ
export const readDB = () => {
  const data = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(data);
};

// WRITE
export const writeDB = (data) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
};