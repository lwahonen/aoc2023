import {fetchInputData} from "./libraries.js";

const year = 2023
const day = 22;

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
// file =
//     `
// 1,0,1~1,2,1
// 0,0,2~2,0,2
// 0,2,3~2,2,3
// 0,0,4~0,2,4
// 2,0,5~2,2,5
// 0,1,6~2,1,6
// 1,1,8~1,1,9
// `
let mat = file.trim().split("\n").map(b => b.split("~").map(c => c.split(",").map(n => parseInt(n))))

let bricks = {}

for (let i = 0; i < mat.length; i++) {
    bricks[i] = []
    let start = mat[i][0]
    let end = mat[i][1]

    for (let x = Math.min(start[0], end[0]); x <= Math.max(start[0], end[0]); x++) {
        for (let y = Math.min(start[1], end[1]); y <= Math.max(start[1], end[1]); y++) {
            for (let z = Math.min(start[2], end[2]); z <= Math.max(start[2], end[2]); z++) {
                bricks[i].push([x, y, z])
            }
        }
    }
}
let brickCount = Object.keys(bricks).length


let onGround=[]
// FALL DOWN
let changed = true
while (changed) {
    changed = false
    for (let top = 0; top < brickCount; top++) {
        let occupied = false
        for (let bottom = 0; bottom < brickCount; bottom++) {
            if (top == bottom)
                continue
            let bottomBrick = bricks[bottom];
            for (const b of bottomBrick) {
                if (occupied)
                    break
                let topBricks = bricks[top];
                for (const t of topBricks) {
                    if (t[2] == 1) {
                        // console.log(`Brick ${top} is on the ground ${JSON.stringify(topBricks)}`)
                        if(!onGround.includes(top))
                            onGround.push(top)
                        occupied = true
                        break
                    }
                    if (t[2] == b[2] + 1 && t[1] == b[1] && t[0] == b[0]) {
                        {
                            // console.log(`Brick ${top} is on top of ${bottom} ${JSON.stringify(topBricks)} / ${JSON.stringify(bottomBrick)}`)
                            occupied = true
                            break
                        }
                    }
                }
            }
        }
        if (!occupied) {
            // console.log("Falling further "+JSON.stringify(bricks[top]))
            changed = true
            let topBrick = bricks[top];
            for (const b of topBrick) {
                b[2]--
            }
            // console.log("Fell to "+JSON.stringify(bricks[top]))
        }
    }
}

changed = true
let bottomMap = {}
let topMap = {}
while (changed) {
    changed = false
    for (let bottom = 0; bottom < brickCount; bottom++) {
        if (!bottomMap.hasOwnProperty(bottom))
            bottomMap[bottom] = []
        for (let top = 0; top < brickCount; top++) {
            if (!topMap.hasOwnProperty(top))
                topMap[top] = []
            if (top == bottom)
                continue
            let supportsThis = false
            let bottomBrick = bricks[bottom];
            for (const b of bottomBrick) {
                if (supportsThis)
                    break
                let topBricks = bricks[top];
                for (const t of topBricks) {
                    if (t[2] == b[2] + 1 && t[1] == b[1] && t[0] == b[0]) {
                        supportsThis = true
                        break
                    }
                }
            }
            if (supportsThis) {
                // console.log(`Block ${bottom} supports ${top} ` + JSON.stringify(bricks[bottom]) + " / " + JSON.stringify(bricks[top]))
                let topMapElement = topMap[top];
                if (!topMapElement.includes(bottom)) {
                    topMapElement.push(bottom)
                    changed = true
                }
                let bottomMapElement = bottomMap[bottom];
                if (!bottomMapElement.includes(top)) {
                    bottomMapElement.push(top)
                    changed = true
                }
            } else {
                // console.log(`Block ${bottom} does not support ${top} ` + JSON.stringify(bricks[bottom]) + " / " + JSON.stringify(bricks[top]))
            }

        }
    }
}

function mustHave(id) {
    let supported = bottomMap[id]
    // console.log(`\nSupported by ${id} ${JSON.stringify(supported)}`)
    if (supported.length == 0) {
        // console.log(`${id} is not supporting anyone`)
        return false
    }
    let mandatory = false
    for (const topper of supported) {
        if (topMap[topper].length == 1) {
            // console.log(`${id} is the only one supporting ${topper}`)
            mandatory = true
        } else {
            // console.log(`${topper} has many supporters ${JSON.stringify(topMap[topper])}`)
        }
    }
    // console.log(`Must keep ${id} ${mandatory}`)
    return mandatory
}

let part1 = 0
let part2 = 0
for (let i = 0; i < brickCount; i++) {
    if (!mustHave(i))
        part1++
}

function fallCount(falling) {
    let moreFalls = false
    for (const fallingElement of falling) {
        let mySupportees = bottomMap[fallingElement];
        for (const i of mySupportees) {
            if (falling.includes(i))
                continue
            let thisfalls = true
            if (onGround.includes(i))
                continue
            let hisSupporters = topMap[i];
            for (const topBrick of hisSupporters) {
                if (falling.includes(topBrick))
                    continue
                // console.log(i + " is not falling, still supported by not falling " + topBrick)
                thisfalls = false
                break
            }
            if (thisfalls) {
                // console.log(i + " falls, only supported by " + JSON.stringify(hisSupporters) + " and falling down " + JSON.stringify(falling))
                falling.push(i)
                moreFalls = true
            }
        }
    }
    return moreFalls
}


for (let i = 0; i < brickCount; i++) {
    let fallers = [i]
     while (fallCount(fallers)) {
         // More fell?
     }
    let chain = fallers.length - 1;
    // console.log(`Fall count for ${i} is ${chain}`)
    part2 += chain
}

console.log("Part 1 " + part1)
console.log("Part 2 " + part2)