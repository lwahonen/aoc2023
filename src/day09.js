import {columns, fetchInputData} from "./libraries.js";
import md5 from "blueimp-md5";

const year = 2023
const day = 9;

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

let d = file.trim().split("\n").map(b => b.split(" ").map(r=>parseInt(r)))
function sequence(arr)
{
    let ans=[]
    for (let i = 0; i < arr.length-1; i++) {
        ans.push(arr[i+1]-arr[i])
    }
    return ans
}

function arrSum(myNums) {
    // create a variable for the sum and initialize it
    let sum = 0;

    // calculate sum using forEach() method
    myNums.forEach(num => {
        sum += num;
    })
    return sum
}

function lastDigit(row, loops) {
    row = sequence(row)
    if (arrSum(row) == 0) {
        return 0;
    }
    let last = lastDigit(row, loops + 1);
    let rowElement = row[row.length - 1];
    let number = rowElement + last;
    return number
}

let part1=0
for (let row of d) {
    let data = lastDigit(row, 0);
    part1+= data+row[row.length-1]
}
console.log("Part 1 "+part1)

let part2=0
for (let row of d) {
    row= row.reverse();

    let data = lastDigit(row, 0);
    part2+= data+row[row.length-1]
}

console.log("Part 2 "+part2)
