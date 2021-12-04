import * as arrow from "@apache-arrow/ts";

const meta = [
  {
    name: "precipitation",
    type: {
      name: "floatingpoint",
      precision: "SINGLE",
    },
    nullable: false,
    children: [],
  },
  {
    name: "date",
    type: {
      name: "date",
      unit: "MILLISECOND",
    },
    nullable: false,
    children: [],
  },
];
const data = arrow.Table.new(
  [
    arrow.FloatVector.from(Float32Array.from([0, 1, 2])),
    arrow.DateVector.from(Array.from([Date.now(), Date.now(), Date.now()])),
  ],
  ["precipitation", "date"],
);

console.log(meta, data);
