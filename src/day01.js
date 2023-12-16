import {columns, fetchInputData, overlappedMatches} from "./libraries.js";

const year = 2023
const day = 1;

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

let f = file.trim().split("\n")

let n = 0;

function  isNumberHere(s, i, parseStrings) {
    let here = s.substring(i)
    let first = parseInt(here.split("")[0])
    if (!isNaN(first)) {
        return first
    }
    if(!parseStrings)
        return NaN

    if (here.startsWith("one"))
        return 1;
    if (here.startsWith("two"))
        return 2;
    if (here.startsWith("three"))
        return 3;
    if (here.startsWith("four"))
        return 4;
    if (here.startsWith("five"))
        return 5;
    if (here.startsWith("six"))
        return 6;
    if (here.startsWith("seven"))
        return 7;
    if (here.startsWith("eight"))
        return 8;
    if (here.startsWith("nine"))
        return 9;
    if (here.startsWith("zero"))
        return 0;
    return NaN;
}

for (let i = 0; i < f.length; i++) {
    let toArray = f[i].split("");
    let first = 0;
    let last = 0;
    for (let j = 0; j < toArray.length; j++) {
        try {
            first = isNumberHere(f[i], j, false)
            if (!isNaN(first)) {
                break
            }
        } catch (e) {

        }
    }
    for (let j = toArray.length-1; j >= 0; j--) {
        try {
            last = isNumberHere(f[i], j, false)
            if (!isNaN(last)) {
                break
            }
        } catch (e) {

        }
    }
    let bb=""+first+last;
    n+=parseInt(bb)
}
console.log("Part 1 "+n)
n=0
for (let i = 0; i < f.length; i++) {
    let toArray = f[i].split("");
    let first = 0;
    let last = 0;
    for (let j = 0; j < toArray.length; j++) {
        try {
            first = isNumberHere(f[i], j, true)
            if (!isNaN(first)) {
                break
            }
        } catch (e) {

        }
    }
    for (let j = toArray.length-1; j >= 0; j--) {
        try {
            last = isNumberHere(f[i], j, true)
            if (!isNaN(last)) {
                break
            }
        } catch (e) {

        }
    }
    let bb=""+first+last;
    n+=parseInt(bb)
}

console.log("Part 2 "+n)
