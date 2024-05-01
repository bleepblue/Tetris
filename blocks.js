import { linesCleared } from "./score.js"
import { spawn } from "./game.js"
import { drawBlocks } from "./game.js"
import { activeTetromino } from "./game.js"

export let blocks = []
let Rows = []

// create 2D array of game board with object for each square

for (let i = 0; i < 20; i++)
{
    blocks[i] = []
    for (let j = 0; j < 10; j++)
    {
        blocks[i][j] = {isOccupied: false, color: ''}
    }
}

// add tetromino to blocks

export function addBlocks (coordinates, color)
{
    activeTetromino = {}
    coordinates.forEach(coordinate=>
    {
        // add blocks to data structure
        blocks[coordinate.y - 1][coordinate.x - 1].isOccupied = true
        blocks[coordinate.y - 1][coordinate.x - 1].color = color

        // draw new blocks
        const element = document.createElement('div')
        const gameBoard = document.getElementById('game-board')
        element.style.gridRowStart = coordinate.y
        element.style.gridColumnStart = coordinate.x
        element.classList.add(color)
        gameBoard.appendChild(element)
    })

}

//  check if the added blocks complete any lines

function checkLineCompletion ()
{
    let rows = []
    for (let i = 0; i < 20; i++)
    {
        if 
        (
                blocks[i].some(element => 
                    {
                        element.isOccupied === false
                    })
        )
        {
            continue
        }
        
        rows.push(i)
    }
    Rows = rows
    if (rows.length > 0)
    {
        linesCleared(rows)
        const deleteList = getLines(rows)
        flash(deleteList)
    }
}

// get DOM reference to lines to be deleted

function getLines(rows)
{

    const allBlocks = document.querySelector('#game-board').childNodes
    let deleteList = []
    rows.forEach(row => {
        allBlocks.forEach(element => {
            if (parseInt(element.style.gridRowStart) == row)
            {
                deleteList.push(element)
            }
        })
    });
    return deleteList
}

// flash lines to be deleted

function flash (deleteList)
{
    let count = 0

    const intervalID = setInterval(() => 
    {
        deleteList.forEach(item=>{
            item.classList.add('white')
        })

        setTimeout(() => 
        {
            deleteList.forEach(item=>{
                item.classList.remove('white')
            })
        }, 
        150)
        if (count === 3)
        {
            clearInterval(intervalID)
            deleteBlocks(Rows)
            gravity(Rows)
        }
    }, 
    300)
}

//delete blocks

function deleteBlocks(rows)
{
    rows.forEach(row =>
    {
        blocks[row].forEach(element =>
        {
            element.isOccupied = false
        })
    })
}

// move all blocks down

function gravity (rows)
{
    const lines = rows.length
    let topRow = rows[0]
    rows.forEach(row => 
        {
            if (row < topRow)
            {
                topRow = row
            }
        })
    for (let i = topRow - 1; i >= 0; i--)
    {
        for (let j = 0; j <= 9; j++)
        {
            if(blocks[i][j].isOccupied === true)
            {
            blocks[i][j].isOccupied = false
            const color = blocks[i][j].color
            blocks[i + lines][j].isOccupied = true
            blocks[i + lines][j].color = color
            }
        }
    }
    drawBlocks()
    spawn()
}



/* module containing 2-dimensional array, filled with objects.
        each objects contains two keys:
            isOccupied(boolean)
            color(string)
    nested for loops to create the object
    when object is added - loop through rows to check if every space in row isOccupied. if true:
        flashing animation
        change all blocks in row to isOcuupied: false (loop through row)
        GRAVITY FUNCTION:
            store number of lines deleted in variable
            nested for loop - outer loop number of rows above top line being deleted
                inner loop 10 (for width of game board)
                    check if isOccupied, and if it is, access object in row i minus {number of lines deleted variable}, column j, and set it to isOccupied: true, color: {color of current object}, and set isOccupied of current object to false.*/
