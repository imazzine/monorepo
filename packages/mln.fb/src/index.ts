import * as fb from "flatbuffers";
import { Monitorable } from "./types/logs/monitorable";

// create builder
const builder = new fb.Builder(1024);

// create string to write to the table
const uid_offset = builder.createString("uid");

// create table
Monitorable.startMonitorable(builder);

// write string to table
Monitorable.addUid(builder, uid_offset);

// save row
const row_offset = Monitorable.endMonitorable(builder);

// instruct the builder that this row is complete
builder.finish(row_offset);

// create buffer after row is complete
const bytes = builder.asUint8Array();

console.log(bytes);

// create buffer from bytes
const buf = new fb.ByteBuffer(bytes);

// create table row object
const row = Monitorable.getRootAsMonitorable(buf);

console.log(row.uid());
