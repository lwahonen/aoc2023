import {fetchInputData} from "./libraries.js";
import os from "os";
import * as fs from "fs";
const year = 2023
const day = 25;

let file = "";

const isBrowser = () => typeof window !== `undefined`
const isNode = !isBrowser()

if (isNode) {
    file = fetchInputData(year, day);
} else {
    const sync_fetch = require('sync-fetch')
    file = sync_fetch(`data/day_${day}.txt`).text();
}

///////////////////////////////////////////////////
// START HERE
///////////////////////////////////////////////////

let path1 = os.homedir() + `/Dropbox/advent/${year}/data/day_${year}_${day}.svg`;
const svg = fs.readFileSync(path1, 'utf-8');

let g1 = 0
let g2 = 0
let label=""
let elements = svg.trim().split("\n");
for (let i = 0; i < elements.length; i++) {
    let r = elements[i]
    if (r.startsWith("<!--")) {
        label = r
    }
    if (!r.includes("ellipse fill=\"none\" stroke=\"black\"")) {
        continue
    }
    let b = r.split("=")
    let v = b[3].split("\"")
    let s = parseInt(v[1])
    if (s > 29030) {
        console.log("Node " + label + " goes to group 2")
        g2++
    } else {
        console.log("Node " + label + " goes to group 1")
        g1++
    }
}
console.log(g1 * g2)