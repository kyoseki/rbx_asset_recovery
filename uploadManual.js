const fs = require("fs");
const path = require("path");
const upload = require("./upload");

const filePath = process.argv[2];
const name = process.argv[3] || path.basename(filePath).split(".").slice(0, -1).join(".");

const data = fs.readFileSync(filePath);

upload(data, name).then(id => {
    console.log(id);
});