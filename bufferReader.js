module.exports = class BufferReader {
    constructor(buffer) {
        this.buffer = buffer;
        this.readHead = 0;
    }

    skip(num) {
        this.readHead += num;
    }

    readUInt16() {
        const value = this.buffer.readUInt16LE(this.readHead);
        this.readHead += 2;
        return value;
    }

    readUInt32() {
        const value = this.buffer.readUInt32LE(this.readHead);
        this.readHead += 4;
        return value;
    }

    readInt32() {
        const value = this.buffer.readInt32LE(this.readHead);
        this.readHead += 4;
        return value;
    }

    readByte() {
        const value = this.buffer.readUInt8(this.readHead);
        this.readHead++;
        return value;
    }

    readSByte() {
        const value = this.buffer.readInt8(this.readHead);
        this.readHead++;
        return value;
    }

    readString(length) {
        const value = this.buffer.toString("utf8", this.readHead, this.readHead + length);
        this.readHead += length;
        return value;
    }

    readBuffer(length) {
        const value = this.buffer.subarray(this.readHead, this.readHead + length);
        this.readHead += length;
        return value;
    }

    readFloat() {
        const value = this.buffer.readFloatLE(this.readHead);
        this.readHead += 4;
        return value;
    }
};
