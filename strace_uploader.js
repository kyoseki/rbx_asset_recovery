const fs = require("fs");
const path = require("path");
const BufferReader = require("./bufferReader");
const axios = require("axios");
const upload = require("./upload");

const map = JSON.parse(fs.readFileSync("asset_mcp_map.json"));

const masterHttp = path.join(__dirname, "ROBLOX_SHIT", "http");

(async function () {
    for (const [k, v] of Object.entries(map)) {
        if (!fs.existsSync(path.join(masterHttp, v))) {
            console.log(k, "NOT FOUND");
            continue;
        }

        const reader = new BufferReader(fs.readFileSync(path.join(masterHttp, v)));
        reader.skip(8);

        const urlLength = reader.readInt32();
        const url = reader.readString(urlLength);

        const data = await axios.get(url, {
            responseType: "arraybuffer"
        }).then(res => res.data);

        const newId = await upload(data, "RenderMesh");

        console.log(k, newId);

        await new Promise(res => setTimeout(res, 2000));
    }
})();