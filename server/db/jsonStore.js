const fs = require("fs-extra");
const path = require("path");

const dataPath = path.join(__dirname, "..", "data");

const readJSON = async (file) => {
  const filePath = path.join(dataPath, file);
  await fs.ensureFile(filePath);
  const content = await fs.readFile(filePath, "utf-8");
  return content ? JSON.parse(content) : [];
};

const writeJSON = async (file, data) => {
  const filePath = path.join(dataPath, file);
  await fs.writeJson(filePath, data, { spaces: 2 });
};

module.exports = { readJSON, writeJSON };
