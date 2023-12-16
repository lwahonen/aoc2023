import {columns, fetchInputData, overlappedMatches} from "./libraries.js";

const year = 2023
const day = 11;

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
// //
// file=`
// ...#......
// .......#..
// #.........
// ..........
// ......#...
// .#........
// .........#
// ..........
// .......#..
// #...#.....
// `

let input=file.trim().split("\n").map(b=>b.split(""))

let emptyRows=[]
let emptyColumns=[]
for (let i = 0; i < input.length; i++) {
    if (!input[i].includes("#")) {
        emptyRows.push(i)
    }
}

let galCols = columns(input);
for (let i = 0; i < galCols.length; i++) {
    if (!galCols[i].includes("#")) {
        emptyColumns.push(i)
    }
}

function countPart(partParameter ) {
    let galaxies = []

    for (let row = 0; row < input.length; row++) {
        let s = ""
        for (let col = 0; col < input[0].length; col++) {
            let finalMapElementElement = input[row][col];
            s += finalMapElementElement
            if (finalMapElementElement == "#")
                galaxies.push([row, col])
        }
    }


    for (let i = 0; i < galaxies.length; i++) {
        let realCol = 0
        let realRow = 0
        for (let row = 0; row < galaxies[i][0]; row++) {
            realRow += 1
            if (emptyRows.includes(row))
                realRow += partParameter - 1
        }
        for (let col = 0; col < galaxies[i][1]; col++) {
            realCol += 1
            if (emptyColumns.includes(col))
                realCol += partParameter - 1
        }
        galaxies[i][0] = realRow
        galaxies[i][1] = realCol
    }

    let part1 = 0
    for (let i = 0; i < galaxies.length; i++) {
        for (let j = i; j < galaxies.length; j++) {
            part1 += Math.abs(galaxies[i][0] - galaxies[j][0])
            part1 += Math.abs(galaxies[i][1] - galaxies[j][1])
        }
    }
    return part1;
}

let part1 = countPart(2);
console.log("Part 1 "+part1)

let part2 = countPart(1000000);
console.log("Part 2 "+part2)
