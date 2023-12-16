import {fetchInputData} from "./libraries.js";

const year = 2023
const day = 7;

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

let cards = file.trim().split("\n").map(b => b.split(" "))

let FIVEOFKIND = 7
let FOUROFKIND = 6
let FULLHOUSE = 5
let THREEOFKIND = 4
let TWOPAIR = 3
let ONEPAIR = 2
let NOWIN = 1

function scoreHand(hand, debug) {
    let cc = {}
    let letters = hand.split("");
    for (const letter of letters) {
        if (cc[letter] == undefined) {
            cc[letter] = 0
        }
        cc[letter]++
    }
    // Five of a kind
    let jokers = 0
    if (inPartTwo) {
        jokers = cc['J'];
        cc['J'] = 0
    }
    if (jokers == 5) {
        if (debug) {
            console.log(hand + " is five of a kind")
        }
        return FIVEOFKIND
    }
    if (jokers == 4) {
        if (debug) {
            console.log(hand + " is five of a kind")
        }
        return FIVEOFKIND
    }

    let values = Object.values(cc);
    if (values.includes(5)) {
        if (debug) {
            console.log(hand + " is five of a kind")
        }
        return FIVEOFKIND;
    }
    // Four
    if (values.includes(4)) {
        if (jokers > 0) {
            if (debug) {
                console.log(hand + " is five of a kind")
            }
            return FIVEOFKIND;
        }
        if (debug) {
            console.log(hand + " is four of a kind")
        }
        return FOUROFKIND;
    }
    if (values.includes((3)) && values.includes(2)) {
        if (jokers == 2) {
            if (debug) {
                console.log(hand + " is five of a kind")
            }
            return FIVEOFKIND;
        }
        if (jokers == 1) {
            if (debug) {
                console.log(hand + " is four of a kind")
            }
            return FOUROFKIND;
        }
        if (debug) {
            console.log(hand + " is full house")
        }
        return FULLHOUSE;
    }

    if (values.includes(3)) {
        if (jokers == 2) {
            if (debug) {
                console.log(hand + " is five of a kind")
            }
            return FIVEOFKIND;
        }
        if (jokers == 1) {
            if (debug) {
                console.log(hand + " is four of a kind")
            }
            return FOUROFKIND;
        }
        if (debug) {
            console.log(hand + " is three of a kind")
        }
        return THREEOFKIND;
    }
    let paircount = 0;
    for (const letterCount of values) {
        if (letterCount == 2) {
            paircount++
        }
    }
    if (paircount == 2) {
        if (jokers == 1) {
            if (debug) {
                console.log(hand + " is full house")
            }
            return FULLHOUSE;
        }
        if (debug) {
            console.log(hand + " is two pair")
        }
        return TWOPAIR;
    }
    if (paircount == 1) {
        if (jokers == 3) {
            if (debug) {
                console.log(hand + " is five of a kind")
            }
            return FIVEOFKIND;
        }
        if (jokers == 2) {
            if (debug) {
                console.log(hand + " is four of a kind")
            }
            return FOUROFKIND;
        }
        if (jokers == 1) {
            if (debug) {
                console.log(hand + " is three of a kind")
            }
            return THREEOFKIND;
        }
        if (debug) {
            console.log(hand + " is pair")
        }
        return ONEPAIR;
    }
    if (jokers == 3) {
        if (debug) {
            console.log(hand + " is four of a kind")
        }
        return FOUROFKIND;
    }
    if (jokers == 2) {
        if (debug) {
            console.log(hand + " is three of a kind")
        }
        return THREEOFKIND;
    }
    if (jokers == 1) {
        if (debug) {
            console.log(hand + " is pair")
        }
        return ONEPAIR;
    }
    if (debug) {
        console.log(hand + " is NOTHING")
    }
    return NOWIN;
}

function isCharNumber(c) {
    return c >= '0' && c <= '9';
}

function cardVal(c) {
    if (isCharNumber(c)) {
        return parseInt(c)
    }
    if (c == "K") {
        return 13
    }
    if (c == "Q") {
        return 12
    }
    if (c == "J") {
        return inPartTwo ? 1 : 11
    }
    if (c == "T") {
        return 10
    }
    if (c == "A") {
        return 14
    }
    return 0
}

function compareCards(first, second) {
    let firstCards = first[0]
    let secondCards = second[0]
    let fs = scoreHand(firstCards, false)
    let ss = scoreHand(secondCards, false)
    if (fs > ss) {
        return 1
    }
    if (fs < ss) {
        return -1;
    }
    for (let i = 0; i < firstCards.length; i++) {
        let firstVal = cardVal(firstCards[i]);
        let secondtVal = cardVal(secondCards[i]);
        if (firstVal > secondtVal) {
            return 1
        }
        if (firstVal < secondtVal) {
            return -1
        }
    }
    return 0
}


let inPartTwo = false
cards = cards.sort(compareCards)
let part1 = 0
for (let i = 0; i < cards.length; i++) {
    let thisCard = cards[i];
    let number = parseInt(thisCard[1]);
    part1 += (i + 1) * number
}

console.log("Part 1 " + part1)
inPartTwo = true
cards = cards.sort(compareCards)
let part2 = 0
for (let i = 0; i < cards.length; i++) {
    let thisCard = cards[i];
    let number = parseInt(thisCard[1]);
    part2 += (i + 1) * number
}
console.log("Part 2 " + part2)
