/*
 * "RBXH" Cache File Format
 * Integers are encoded in little endian
 *
 * 4 bytes: String, magic string ("RBXH")
 * 4 bytes: Integer, unknown meaning (version number?)
 * 4 bytes: Integer, length of the following URL
 * x+1 bytes: The URL, + a null terminator (0x00) (?)
 * 4 bytes: Integer, Status of HTTP request
 * 4 bytes: Integer, length of the full HTTP header data
 * 4 bytes: Unknown meaning
 * 4 bytes: Length of the payload
 * 8 bytes: Unknown meaning
 * x bytes: The HTTP header data
 * x bytes: The payload (actual file data)
 */

/*
 * Main formats:
 * KTX: OpenGL texture format (tools are online to convert these to .png)
 * PNG: Regular image files
 * OGG: Audio
 * ROBLOX Mesh (exported as .rbxmesh): Special ROBLOX mesh files (https://devforum.roblox.com/t/roblox-mesh-format/326114)
 */

// First four bytes of the KTX header
const ktxHeader = [
    0xAB, 0x4B, 0x54, 0x58
];

const oggHeader = [
    0x4f, 0x67, 0x67, 0x53
];

const pngHeader = [
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a
];

function checkHeader(buffer, headerArr) {
    if (buffer.length < headerArr.length)
        return false;

    for (let i = 0; i < headerArr.length; i++) {
        if (buffer.readUint8(i) !== headerArr[i])
            return false;
    }

    return true;
}

const fs = require("fs");
const path = require("path");
const { Document, NodeIO } = require("@gltf-transform/core");
const { Matrix4, Vector3, Vector4 } = require("math.gl");
const BufferReader = require("./bufferReader");

const dir = path.join(__dirname, "http");
const outDir = path.join(__dirname, "out");
const outDirUnknown = path.join(outDir, "unknown");
const manifestPath = path.join(__dirname, "manifest.json");
const files = fs.readdirSync(dir);

if (!fs.existsSync(outDir))
    fs.mkdirSync(outDir);

if (!fs.existsSync(outDirUnknown))
    fs.mkdirSync(outDirUnknown);

let manifest;
if (fs.existsSync(manifestPath))
    manifest = JSON.parse(fs.readFileSync(manifestPath));

let alreadyExported = {};

function search(searchPath) {
    const headers = fs.readdirSync(searchPath).filter(f => f.endsWith(".headers"));

    for (const file of headers) {
        const contents = fs.readFileSync(path.join(searchPath, file), "utf-8");
        const hash = contents.split("\n")[1].split("/").slice(-1)[0];

        console.log(hash, "is already exported. Adding to skip list.");

        alreadyExported[hash] = true;
    }
}

const idPath = path.join(__dirname, "glb_identifier/assets/identified");

search("glb_identifier/assets/discarded");
search(idPath);

const idFiles = fs.readdirSync(idPath);

for (const folder of idFiles) {
    if (!fs.lstatSync(path.join(idPath, folder)).isDirectory())
        continue;

    search(path.join(idPath, folder));
}

function readMesh(payload) {
    const reader = new BufferReader(payload);
    reader.skip(8); // "version "

    const version = reader.readString(4);
    reader.skip(1); // \n

    if (version === "4.00" || version === "4.01") {
        // ushort sizeof_MeshHeader
        let sizeOfHeader = reader.readUInt16();
        if (sizeOfHeader !== 24)
            console.warn("Unexpected header size:", sizeOfHeader);

        // ushort numMeshes
        const numMeshes = reader.readUInt16();

        // uint numVerts
        const numVerts = reader.readUInt32();

        // uint numFaces
        const numFaces = reader.readUInt32();

        // ushort numLODs
        const numLODs = reader.readUInt16();

        // ushort numBones
        const numBones = reader.readUInt16();

        // uint nameTableSize
        const nameTableSize = reader.readUInt32();

        // ushort numSubsets
        const numSubsets = reader.readUInt16();

        // byte numHighQualityLODs
        const numHighQualityLODs = reader.readByte();

        // byte reserved
        reader.skip(1);

        // Vertices
        const vertices = [];

        for (var i = 0; i < numVerts; i++) {
            // Vertex
            const px = reader.readFloat();
            const py = reader.readFloat();
            const pz = reader.readFloat();

            // Normal
            const nx = reader.readFloat();
            const ny = reader.readFloat();
            const nz = reader.readFloat();

            // UV
            const u = reader.readFloat();
            const v = reader.readFloat();

            // Tangents
            const tx = reader.readSByte();
            const ty = reader.readSByte();
            const tz = reader.readSByte();
            const tw = reader.readSByte();

            // Color
            const r = reader.readByte();
            const g = reader.readByte();
            const b = reader.readByte();
            const a = reader.readByte();

            vertices.push({
                px, py, pz, nx, ny, nz, u, v, tx, ty, tz, tw, r, g, b, a
            });
        }

        // Envelopes
        const envelopes = [];

        if (numBones > 0) {
            for (let i = 0; i < numVerts; i++) {
                // Bones
                const b1 = reader.readByte();
                const b2 = reader.readByte();
                const b3 = reader.readByte();
                const b4 = reader.readByte();

                // Weights
                const w1 = reader.readByte();
                const w2 = reader.readByte();
                const w3 = reader.readByte();
                const w4 = reader.readByte();

                envelopes.push({
                    b1, b2, b3, b4, w1, w2, w3, w4
                });
            }
        }

        const faces = [];

        // Faces
        for (let i = 0; i < numFaces; i++) {
            // Indices
            const i1 = reader.readUInt32();
            const i2 = reader.readUInt32();
            const i3 = reader.readUInt32();

            faces.push({
                i1, i2, i3
            });
        }

        // LODs
        const lods = [];

        for (let i = 0; i < numLODs; i++) {
            lods.push(reader.readUInt32());
        }

        // Bones
        const bones = [];

        for (let i = 0; i < numBones; i++) {
            const nameTableIndex = reader.readUInt32();

            // === 0xFFFF when no parent
            const parentIndex = reader.readUInt16();
            const lodParentIndex = reader.readUInt16();

            const culling = reader.readFloat();

            const r00 = reader.readFloat();
            const r01 = reader.readFloat();
            const r02 = reader.readFloat();
            const r10 = reader.readFloat();
            const r11 = reader.readFloat();
            const r12 = reader.readFloat();
            const r20 = reader.readFloat();
            const r21 = reader.readFloat();
            const r22 = reader.readFloat();

            const x = reader.readFloat();
            const y = reader.readFloat();
            const z = reader.readFloat();

            bones.push(
                { nameTableIndex, parentIndex, lodParentIndex, culling, r00, r01, r02, r10, r11, r12, r20, r21, r22, x, y, z }
            );
        }

        // Name table
        // Special handling due to weird reading logic

        for (const bone of bones) {
            const buf = reader.buffer;
            const bytes = [];

            let idx = reader.readHead + bone.nameTableIndex;
            let byte = buf.readInt8(idx);
            idx++;

            while (byte !== 0x00) {
                bytes.push(byte);
                byte = buf.readInt8(idx);
                idx++;
            }

            bone.name = Buffer.from(bytes).toString("utf8");
        }

        reader.skip(nameTableSize);

        // Mesh Subsets
        const subsets = [];

        for (let i = 0; i < numSubsets; i++) {
            const facesBegin = reader.readUInt32();
            const facesLength = reader.readUInt32();

            const vertsBegin = reader.readUInt32();
            const vertsLength = reader.readUInt32();

            const numBoneIndices = reader.readUInt32();

            const boneIndices = [];

            for (let j = 0; j < numBoneIndices; j++) {
                boneIndices.push(reader.readUInt16());
            }

            reader.skip((26 - numBoneIndices) * 2);

            subsets.push({
                facesBegin, facesLength, vertsBegin, vertsLength, boneIndices
            });
        }

        return { vertices, envelopes, faces, lods, bones, subsets };
    }
}

/*
 * ROBLOX is: +X Right, +Y Up, -Z Forward
 * gLTF is: -X Right, +Y Up, +Z Forward
 * (180 degrees rotation)
 */
const coordinateTransformMatrix = Matrix4.IDENTITY.clone().rotateY(Math.PI);

function transformVector(x, y, z) {
    return new Vector3(x, y, z).transform(coordinateTransformMatrix);
}

async function meshToGLTF(meshData) {
    const { vertices, envelopes, faces, lods, bones, subsets } = meshData;

    const doc = new Document();

    const vertexBuffer = [];
    const normalBuffer = [];
    const tangentBuffer = [];
    const uvBuffer = [];
    const indices = [];

    for (let i = 0; i < vertices.length; i++) {
        const { px, py, pz, nx, ny, nz, tx, ty, tz, tw, u, v } = vertices[i];

        const posT = transformVector(px, py, pz);

        vertexBuffer.push(posT.x);
        vertexBuffer.push(posT.y);
        vertexBuffer.push(posT.z);

        const normalT = transformVector(nx, ny, nz);

        normalBuffer.push(normalT.x);
        normalBuffer.push(normalT.y);
        normalBuffer.push(normalT.z);

        const tangentT = new Vector4(tx, ty, tz, tw).transform(coordinateTransformMatrix);

        tangentBuffer.push(tangentT.x);
        tangentBuffer.push(tangentT.y);
        tangentBuffer.push(tangentT.z);
        tangentBuffer.push(tangentT.w);

        uvBuffer.push(u);
        uvBuffer.push(v);
    }

    const facesStart = lods[0];
    const facesEnd = lods[1];

    for (let i = facesStart; i < facesEnd; i++) {
        const face = faces[i];

        indices.push(face.i1);
        indices.push(face.i2);
        indices.push(face.i3);
    }

    const buffer = doc.createBuffer();

    const positionA = doc.createAccessor()
        .setType("VEC3")
        .setArray(new Float32Array(vertexBuffer))
        .setBuffer(buffer);

    const normalA = doc.createAccessor()
        .setType("VEC3")
        .setArray(new Float32Array(normalBuffer))
        .setBuffer(buffer);

    const indicesA = doc.createAccessor()
        .setType("SCALAR")
        .setArray(new Uint32Array(indices))
        .setBuffer(buffer);

    const tangentA = doc.createAccessor()
        .setType("VEC4")
        .setArray(new Float32Array(tangentBuffer))
        .setBuffer(buffer);

    const uvA = doc.createAccessor()
        .setType("VEC2")
        .setArray(new Float32Array(uvBuffer))
        .setBuffer(buffer);

    const prim = doc.createPrimitive()
        .setAttribute("POSITION", positionA)
        .setAttribute("NORMAL", normalA)
        .setAttribute("TANGENT", tangentA)
        .setAttribute("TEXCOORD_0", uvA)
        .setIndices(indicesA);

    const mesh = doc.createMesh().addPrimitive(prim);
    const node = doc.createNode().setMesh(mesh);
    const scene = doc.createScene().addChild(node);

    return new NodeIO().writeBinary(doc);
}

(async function () {
    for (const file of files) {
        const contents = fs.readFileSync(path.join(dir, file));
        const reader = new BufferReader(contents);

        // Read magic string
        const magicString = reader.readString(4);
        if (magicString !== "RBXH") {
            continue;
        }

        // Unknown meaning; skip
        reader.skip(4);

        // URL length
        const urlLength = reader.readInt32();

        // URL
        const url = reader.readString(urlLength);
        reader.skip(1); // +1 for null terminator (or whatever it is)

        // HTTP status
        const status = reader.readInt32();

        // HTTP header length
        const headerLength = reader.readInt32();

        // Unknown meaning; skip
        reader.skip(4);

        // Payload length
        const payloadLength = reader.readInt32();

        // Unknown meaning; skip
        reader.skip(8);

        // HTTP headers
        const httpHeaders = reader.readString(headerLength);

        // Payload
        const payload = reader.readBuffer(payloadLength);

        let extension = "";
        let shouldSave = false;

        // Try ident: PNG
        if (checkHeader(payload, pngHeader)) {
            extension = ".png";
            shouldSave = true;
            continue;
        }
        // Try ident: OGG
        else if (checkHeader(payload, oggHeader)) {
            extension = ".ogg";
            continue;
        }
        // Try ident: KTX
        else if (checkHeader(payload, ktxHeader)) {
            extension = ".ktx";
            shouldSave = true;
            continue;
        }
        // Try ident: ROBLOX mesh
        else if (payloadLength >= 12 && payload.toString("utf8", 0, 8) === "version ") {
            extension = ".rbxmesh";

            var assetHash = url.split("/").slice(-1)[0];

            if (alreadyExported[assetHash] || manifest && Object.values(manifest.manifest).find(item => item === assetHash)) {
                console.log("SKIP", assetHash);
                continue;
            }

            const readResult = readMesh(payload);

            // if (!readResult) {
                // console.log(file);
                // shouldSave = true;
            // }

            if (readResult) {
                const result = await meshToGLTF(readResult);
                fs.writeFileSync(path.join(outDir, file + ".glb"), result);
            }

            shouldSave = true;
        }
        ////
        else
            continue;


        if (!shouldSave)
            continue;

        const exportDir = extension === "" ? outDirUnknown : outDir;

        const headerFileContents = `FILE: ${file}
URL: ${url}
--------

${httpHeaders}`;

        fs.writeFileSync(path.join(exportDir, file + extension + ".headers"), headerFileContents);
        fs.writeFileSync(path.join(exportDir, file + extension), payload);
    }
})();
