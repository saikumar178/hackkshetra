import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const readJSON = async (file) => {
  const filePath = path.join(__dirname, "..", "data", file);
  await fs.ensureFile(filePath);
  const data = await fs.readFile(filePath, "utf-8");
  return data ? JSON.parse(data) : [];
};

export const writeJSON = async (file, data) => {
  const filePath = path.join(__dirname, "..", "data", file);
  await fs.writeJson(filePath, data, { spaces: 2 });
};
