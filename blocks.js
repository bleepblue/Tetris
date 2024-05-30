import { linesCleared } from "./score.js"
import { spawn } from "./game.js"
import { drawBlocks } from "./game.js"
import { activeBlockFunc } from "./game.js"
import { activeTetromino } from "./game.js"

export let blocks = []
let Rows = []

// create 2D array of game board with object for each square.

// blocks are 0-indexed!!! they are always 1 behind CSS grid coordinates.

// first array is Y values; second array is X values.

for (let i = 0; i < 20; i++)
{
    blocks[i] = []
    for (let j = 0; j < 10; j++)
    {
        blocks[i][j] = {isOccupied: false, color: ''}
    }
}

// add tetromino to blocks

export function addBlocks ()
{
    
    activeBlockFunc()
    activeTetromino[activeTetromino.current_rotation].forEach(coordinate=>
    {
        // add blocks to data structure
        blocks[coordinate.y - 1][coordinate.x - 1].isOccupied = true
        blocks[coordinate.y - 1][coordinate.x - 1].color = activeTetromino.color

        // draw new blocks
        document.querySelectorAll('.active').forEach(element=>
            {
                element.remove()
            })
        const element = document.createElement('div')
        const gameBoard = document.getElementById('game-board')
        element.style.gridRowStart = coordinate.y
        element.style.gridColumnStart = coordinate.x
        element.classList.add(activeTetromino.color)
        gameBoard.appendChild(element) 
    })
    checkLineCompletion()

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
                        return element.isOccupied === false
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
    else
    {
        spawn()
    }
}


// REMEMBER HERE THAT ALL REFERENCES TO GRID MUST BE BLOCKS PLUS ONE

// get DOM reference to lines to be deleted

function getLines(rows)
{

    const allBlocks = document.querySelector('#game-board').childNodes
    let deleteList = []
    rows.forEach(row => {
        allBlocks.forEach(element => {
            if (parseInt(element.style.gridRowStart) == row + 1)
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
        if (count === 3)
            {
                clearInterval(intervalID)
                deleteBlocks(Rows)
                gravity(Rows)
            }
        else
        {
            deleteList.forEach(item=>{
                item.style.backgroundColor='white'
            })

            setTimeout(() => 
            {
                deleteList.forEach(item=>{
                    item.style.backgroundColor='black'
                })
            }, 
            80)
            count++
        }
    }, 
    160)
}



//delete blocks

function deleteBlocks(rows)
{
    rows.forEach(row =>
    {
        blocks[row].forEach(block =>
        {
            block.isOccupied = false
        })
    })
}

// move all blocks down

function gravity (rows)
{
    let lines = 1
    const bottom = Math.max.apply(null, rows)
    for (let i = Math.max.apply(null, rows) - 1; i >= 0; i--)
    {
        if (lines < rows.length)
            {
                if (rows.includes(i))
                    {
                        lines++
                        continue
                    }
            }
        for (let j = 0; j <= 9; j++)
        {
            if(blocks[i][j].isOccupied === true)
            {
            blocks[i][j].isOccupied = false
            blocks[i + lines][j].isOccupied = true
            blocks[i + lines][j].color = blocks[i][j].color
            }
        }
    }
    drawBlocks()
    spawn()
}
