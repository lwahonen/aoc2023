import {columns, fetchInputData, overlappedMatches} from "./libraries.js";

import crypto from "crypto";

const year = 2023
const day = 15;

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

let ss=file.trim().split(",")

function hashN(s)
{
    let sc=0
    for (let i = 0; i < s.length; i++) {
        let c=s.charCodeAt(i)
        sc+=c
        sc *= 17
        sc=sc % 256
    }
    return sc
}

let part1=0
for (const s of ss) {
    part1+=hashN(s)
}
console.log(part1)

let lenses=[]
for (let i = 0; i < 256; i++) {
    lenses[i] = []
}

for (const s of ss) {
    if (s.includes("=")) {
        let b = s.split("=")
        let label = b[0]
        let str = parseInt(b[1])
        let number1 = hashN(label);
        let box = lenses[number1];
        for (let i = 0; i < box.length; i++) {
            if (box[i].label == label) {
                box[i] = {label: label, str: str, box:number1}
                box = null
                break
            }
        }
        if (box != null) {
            box.push({label: label, str: str, box:number1})
        }
    }
    if (s.includes("-")) {
        let b = s.split("-")
        let label = b[0]
        let number = hashN(label);
        let box = lenses[number];
        let newboxes = []
        for (let i = 0; i < box.length; i++) {
            if (box[i].label != label) {
                newboxes.push(box[i])
            }
        }
        lenses[number] = newboxes
    }
}

let part2=0
for (let i = 0; i < lenses.length; i++) {
    for (let j = 0; j < lenses[i].length; j++) {
        let bs=lenses[i][j].str * (j+1)*(i+1)
        part2+=bs
    }
}
console.log(part2)