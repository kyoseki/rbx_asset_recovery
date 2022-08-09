const axios = require("axios");
const fs = require("fs");

module.exports = (data, name) => {
    return axios({
        method: "post",
        url: `https://data.roblox.com/ide/publish/UploadNewMesh`,
        headers: {
            "Cookie": fs.readFileSync("cookies.txt", "utf8"),
            "User-Agent": "Roblox/WinINet"
        }
    })
        .catch(err => {
            if (!err.response)
                return;

            const xsrf = err.response.headers["x-csrf-token"];

            return axios({
                method: "post",
                url: `https://data.roblox.com/ide/publish/UploadNewMesh?name=${name}&description=${name}`,
                headers: {
                    "Cookie": fs.readFileSync("cookies.txt", "utf8"),
                    "User-Agent": "Roblox/WinINet",
                    "X-CSRF-Token": xsrf,
                    "Content-Length": data.length.toString()
                },
                data
            })
                .then(res => {
                    return `rbxassetid://${res.data}`;
                });
        });
};
