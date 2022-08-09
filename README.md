# Asset Recovery Archive

This is an archive of the tools I created and used to recover Roblox assets from cache.

It might not be in the best shape to be run - you can definitely use it as reference though.

File structure and is preserved, but as can be seen by `.gitignore`, a lot of things have been omitted.

A lot of these files are hardcoded to do certain things with certain data. I'll try to explain them below though.

## Processes

### 1. Manual identification

- Filtered assets are exported to `out/` using `load.js`
- Exported assets are moved to `glb_identifier/assets/out/` and two sibling directories to `out`, `discarded` and `identified` are made
- `glb_identifier` is run to search through the mesh list and identify/discard each one.
- Use `uploadManual.js` to upload each found mesh to Roblox manually.

Some rudimentary filtering was performed for this method:

- By date, knowing when most meshes were likely to have been uploaded
- Later, by querying the Roblox API with every known used mesh and exporting only known archived meshes

### 2. With `strace`

This method assumes Roblox Studio is run on Linux with Grapejuice (based on Wine).

- Use `finder.js` to create a `manifest.json` containing data on every known used mesh/decal
- Create an empty baseplate in Roblox Studio.
- Run `strace -f -e trace=lstat -p [STUDIO PROCESS ID] -o strace.log` to log every time Roblox Studio queries a file.
- Use `meshloader.lua` or `decalloader.lua` to load each mesh/decal in Roblox Studio sequentially
- Kill `strace` after the Lua script finishes.
- Use `strace_processor.js` to process `strace.log` and map each ID to its `http` cache filename.
- Run `strace_uploader.js` to upload every found mesh, or `strace_exporter.js` to export every found decal.

## Files and descriptions

### Lua files

- `meshloader.lua` - Run in Roblox Studio console to load every mesh in the list. For use with `strace`.
- `meshreplace.lua` - A plugin file for quickly replacing a mesh ID in the explorer without having the MeshPart's size reset.
- `decalloader.lua` - Run in Roblox Studio console to load every decal in the list. For use with `strace`.
- `assetreplacer.lua` - A plugin file which allows mass replacement of textures, decals, and meshes.

### JavaScript files

- `bufferReader.js` - A utility file to assist with reading sequential data from a buffer
- `load.js` - Responsible for parsing each cache file, identifying its type, and deciding whether it should be exported.
    - Certain files will get ignored depending on what files have been identified/discarded with `glb_identifier` and what assets are known to be good in `manifest.json`
    - Meshes are exported in Roblox's own format and also converted to .glb (this conversion is incomplete and ignores e.g. mesh skinning)
- `finder.js` - Contains many newline-separated lists of asset IDs (thousands of lines long) and queries the Roblox API to see if they are archived or not. Outputs the result to `manifest.json`.
- `manifest_stats.js` - Searches through `manifest.json` and prints every archived or "not approved" asset.
- `strace_processor.js` - Processes `strace.log` using an ordered list of asset IDs, in the same order they were loaded using Lua. Outputs to `asset_mcp_map.json` (MCP stands for MeshContentProvider, the service responsible for loading mesh files from cache).
- `upload.js` - A utility file to upload a mesh to Roblox. Uses `cookies.txt` for authentication. This file just contains `.ROBLOSECURITY=[COOKIE DATA]`.
- `strace_exporter.js` - Uses the asset map to export found files to `out/`. Currently hardcoded to assume .ktx format.
- `strace_uploader.js` - Uses the asset map to upload all meshes to Roblox. Only for meshes.
- `uploadManual.js` - Program which takes a file path argument and an optional name. Uploads the mesh to Roblox manually.

### Rust files

- `glb_identifier/` - A Rust program responsible for viewing, naming, and sorting .glb mesh files.

### Other

- `PVRTexToolCLI` (gitignored) - Used here to convert .ktx to .png. Can be found [here](https://developer.imaginationtech.com/pvrtextool/), but you need an account to download it (yuck).
- `convert_ktx.sh` - A shell script to run `PVRTexToolCLI` on every ktx file in the `out/` folder.
