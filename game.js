
import { tetrominoes, I_shape, L_shape, J_shape, O_shape, S_shape, Z_shape, T_shape } from "./tetrominoes.js"
import { blocks } from "./blocks.js"
import { addBlocks } from "./blocks.js"
import { gameSpeed } from "./score.js"

// TODO: 


//clean up code (ie move movement/input to separate module)
//aesthetic features (including score counter and music)
//pause

let lastBlockFall = 0
export let activeTetromino = {}
let intervalID

function main(currentTime) 
{
    window.requestAnimationFrame(main)
    if ((currentTime - lastBlockFall) < gameSpeed) return
    if (activeTetromino.color)
    {
        moveDown()    
    }
    lastBlockFall = currentTime
}

window.addEventListener('load', () =>
{
    spawn()
    window.requestAnimationFrame(main)
})

// choose new random tetromino

function newActiveTetromino()
{
    const num = Math.floor(Math.random() * 7 )
    activeTetromino = { ...tetrominoes[num]}
}


// draw the active tetromino

function drawActive()
{
    document.querySelectorAll('.active').forEach(element=>
    {
        element.remove()
    })
    const rotation = activeTetromino.current_rotation
    const coordinates = activeTetromino[rotation]
    const color = activeTetromino.color
    coordinates.forEach(coordinate=>
    {
        const element = document.createElement('div')
        element.classList.add(color, "active")
        element.style.gridRowStart = coordinate.y
        element.style.gridColumnStart = coordinate.x
        document.getElementById('game-board').appendChild(element)
    })
}

export function drawBlocks()
{
    const gameBoard = document.getElementById('game-board')
    gameBoard.innerHTML = ''
    const fragment = document.createDocumentFragment()
    for (let i = 0; i < 20; i++)
    {
        for (let j = 0; j < 10; j++)
        {
            if (blocks[i][j].isOccupied === true)
            {
                const element = document.createElement('div')
                element.style.gridRowStart = i + 1
                element.style.gridColumnStart = j + 1
                element.classList.add(blocks[i][j].color)
                fragment.appendChild(element)
            }
        }
    }
    gameBoard.appendChild(fragment)
    
}

// check if new tetromino placement is legal

function check(coordinates)
{
    return coordinates.every(coordinate=>
    {
        blocks[coordinate.y - 1][coordinate.x - 1].isOccupied === false
    })
}

// spawn new tetromino

export function spawn()
{
    newActiveTetromino()
    if (check(activeTetromino[0]))
    {
        drawActive()
    }
    else
    {
        gameOver()
    }
}


// game over

function gameOver()
{
    if (confirm("Game over. Do you want to play again?"))
    {
        window.location = "/"
    }
}

// MOVEMENT

// move active tetromino down by one

function moveDown(gravity = true)
{
    const rotation = activeTetromino.current_rotation
    let coordinates = activeTetromino[rotation]
    coordinates.forEach(coordinate=>
        {
            coordinate.y++
        })
    if (check(coordinates))
    {
        for (let key in activeTetromino)
        {
            if (!isNaN(parseInt(key)))
            {
                activeTetromino[key].forEach(coordinate=>
                {
                    coordinate.y++
                })
            }
        }
        drawActive()
        if (!gravity)
        {
            intervalID = setInterval(moveDown, 125)
        }
    }
    else
    {
        addBlocks(activeTetromino[rotation], activeTetromino.color)
        newActiveTetromino()
        drawActive()

    }

}

// move active tetromino left by one

function moveLeft()
{
    const rotation = activeTetromino.current_rotation
    let coordinates = activeTetromino[rotation]
    coordinates.forEach(coordinate=>
        {
            coordinate.x--
        })
    if (check(coordinates))
    {
        for (let key in activeTetromino)
        {
            if (!isNaN(parseInt(key)))
            {
                activeTetromino[key].forEach(coordinate=>
                {
                    coordinate.x--
                })
            }
        }
        drawActive()
        intervalID = setInterval(moveLeft, 125)
    }

}

// move active tetromino right by one

function moveRight()
{
    const rotation = activeTetromino.current_rotation
    let coordinates = activeTetromino[rotation]
    coordinates.forEach(coordinate=>
        {
            coordinate.x++
        })
    if (check(coordinates))
    {
        for (let key in activeTetromino)
        {
            if (!isNaN(parseInt(key)))
            {
                activeTetromino[key].forEach(coordinate=>
                {
                    coordinate.x++
                })
            }
        }
        drawActive()
        intervalID = setInterval(moveRight, 125)
    }

}

// rotate clockwise

function clockwise()
{
    switch(activeTetromino.color)
    {
        case "cyan":
            if (activeTetromino.current_rotation === 1)
            {
                activeTetromino.current_rotation = 0
            }
            else
            {
                activeTetromino.current_rotation++
            }
            drawActive()
            return
        case "blue":
            if (activeTetromino.current_rotation === 3)
            {
                activeTetromino.current_rotation = 0
            }
            else
            {
                activeTetromino.current_rotation++
            }
            drawActive()
            return
        case "orange":
            if (activeTetromino.current_rotation === 1)
            {
                activeTetromino.current_rotation = 0
            }
            else
            {
                activeTetromino.current_rotation++
            }
            drawActive()
            return
        case "yellow":
            return
        case "green":
            if (activeTetromino.current_rotation === 1)
            {
                activeTetromino.current_rotation = 0
            }
            else
            {
                activeTetromino.current_rotation++
            }
            drawActive()
            return
        case "purple":
            if (activeTetromino.current_rotation === 3)
            {
                activeTetromino.current_rotation = 0
            }
            else
            {
                activeTetromino.current_rotation++
            }
            drawActive()
            return
        case "red":
            if (activeTetromino.current_rotation === 1)
            {
                activeTetromino.current_rotation = 0
            }
            else
            {
                activeTetromino.current_rotation++
            }
            drawActive()
            return
    }
}

//rotate counter-clockwise

function counterClockwise()
{
    switch(activeTetromino.color)
    {
        case "cyan":
            if (activeTetromino.current_rotation === 0)
            {
                activeTetromino.current_rotation = 1
            }
            else
            {
                activeTetromino.current_rotation--
            }
            drawActive()
            return
        case "blue":
            if (activeTetromino.current_rotation === 0)
            {
                activeTetromino.current_rotation = 3
            }
            else
            {
                activeTetromino.current_rotation--
            }
            drawActive()
            return
        case "orange":
            if (activeTetromino.current_rotation === 0)
            {
                activeTetromino.current_rotation = 1
            }
            else
            {
                activeTetromino.current_rotation--
            }
            drawActive()
            return
        case "yellow":
            return
        case "green":
            if (activeTetromino.current_rotation === 0)
            {
                activeTetromino.current_rotation = 1
            }
            else
            {
                activeTetromino.current_rotation--
            }
            drawActive()
            return
        case "purple":
            if (activeTetromino.current_rotation === 0)
            {
                activeTetromino.current_rotation = 3
            }
            else
            {
                activeTetromino.current_rotation--
            }
            drawActive()
            return
        case "red":
            if (activeTetromino.current_rotation === 0)
            {
                activeTetromino.current_rotation = 1
            }
            else
            {
                activeTetromino.current_rotation--
            }
            drawActive()
            return
    }
}

// hard drop

function hardDrop()
{
    let coordinates = activeTetromino[activeTetromino.current_rotation]
    while (true)
    {
        let newCoordinates = coordinates
        newCoordinates.forEach(coordinate=>
        {
            coordinate.y -= 1
        })
        if (check(newCoordinates))
        {
            coordinates = newCoordinates
            continue
        }
        else
        {
            break
        }
    }
    addBlocks(coordinates, activeTetromino.color)
}

// INPUT

window.addEventListener('keydown', e =>
{
    switch(e.key)
    {
        case " ":
            hardDrop()
            break

        case "ArrowUp":
        case "x":
            clockwise()
            break

        case "Control":
        case "z":
            counterClockwise()
            break
        
        case "ArrowLeft":
            intervalID = setTimeout(moveLeft, 250)
            break

        case "ArrowRight":
            intervalID = setTimeout(moveRight, 250)

        case "ArrowDown":
            intervalID = setTimeout(moveDown, 250, false)
            break
    }
})

window.addEventListener('keyup', () =>
{
    clearInterval(intervalID)
})

 
/* game update logic

game redraws at regular intervals (for gravity) OR after input (that is not blocked)
also redraws after line deletion in blocks module
only active piece is redrawn

*/

/* 
   obviously will have to check that move is possible first.
   copy object from module into new 'active' object in this module.
   the function that checks if the move is possible calls the 'add block' function in blocks module if 
   gravity or hard drop or soft drop caused the active block to be blocked by the blocks. 
   then the active block is deleted and a new block is spawned.
*/

/* the check if move legal function can simply scan blocks to see if the desired co-ordinates are occupied or not (or if the
co ordinates do not exist - can work by simply checking if isOccupied : false is true) */


/*
game logic

pieces fall at prescribed gamespeed
appear at top
one press moves it, hold down key makes it move faster
distinguish between static and moving
when it becomes static - 
    check for line clear
    if no line clear, check for touch top - game over
every time it moves down, check for touch 


object with all static tetrominoes in it




    
    input(keydown) triggers function
        function :
            settimeout for move (change tetromino co-ordinates and redraw)
            setinterval for fast move (change tetromino co-ordinates and redraw)
    input(keyup) triggers function
        function:
            cleartimeout for fastmove

    input rotate is timeout (change tetromino co-ordinates and redraw)

    input soft drop is setinterval AND cancels block fall (triggers boolean that block fall looks for)
    input softdrop keyup clearinterval

    input hard drop just straight up changes the tetromino co-ordinates and redraws




    separate module for tetromino positioning

    object for each tetromino
        each object contains relative positions of each square of the tetromino
            bottom-most, left-most, right-most, and top-most square(s) is marked in every case
            

        movement module    
            every move check new position to see if legal:
        if violates sides, bottom or top, does not allow move
        if pieces blockiing bottom, block becomes static. 
          
        
    module containing 2-dimensional array, filled with objects.
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
                    check if isOccupied, and if it is, access object in row i minus {number of lines deleted variable}, column j, and set it to isOccupied: true, color: {color of current object}, and set isOccupied of current object to false.

    
    score module. also includes level . work this out later
    

    */


