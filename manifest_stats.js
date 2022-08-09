const fs = require("fs");
const manifest = JSON.parse(fs.readFileSync("manifest.json"));

for (var [a, b] of Object.entries(manifest.manifest)) {
    if (b === "archived") {
        console.log(a);
    }
}

console.log("*****************");

for (var [a, b] of Object.entries(manifest.manifest)) {
    if (b === "not approved") {
        console.log(a);
    }
}
