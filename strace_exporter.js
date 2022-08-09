const fs = require("fs");
const path = require("path");
const BufferReader = require("./bufferReader");
const axios = require("axios");

const masterHttp = path.join(__dirname, "ROBLOX_SHIT", "http");
const map = JSON.parse(fs.readFileSync("asset_mcp_map.json"));

(async function () {
    for (const [k, v] of Object.entries(map)) {
        const filePath = path.join(masterHttp, v);

        if (fs.existsSync(filePath)) {
            const reader = new BufferReader(fs.readFileSync(path.join(masterHttp, v)));
            reader.skip(8);

            const urlLength = reader.readInt32();
            const url = reader.readString(urlLength);
            const data = await axios.get(url, {
                responseType: "arraybuffer"
            }).then(res => res.data);

            fs.writeFileSync(path.join("out", k + ".ktx"), data);
        } else {
            console.log(k, "NOT FOUND");
        }
    }
})();
