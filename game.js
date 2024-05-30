
import { tetrominoes, I_shape, L_shape, J_shape, O_shape, S_shape, Z_shape, T_shape } from "./tetrominoes.js"
import { blocks } from "./blocks.js"
import { addBlocks } from "./blocks.js"
import { gameSpeed } from "./score.js"

// TODO: 


//clean up code (ie move movement/input to separate module)
//aesthetic features (including score counter and music)
//pause

let lastBlockFall = 0
export let activeTetromino
let activeBlock = false
let time
/* let intervalID */

function main(currentTime) 
{
    window.requestAnimationFrame(main)
    time = currentTime
    if ((time - lastBlockFall) < gameSpeed) return
    moveDown()    
    lastBlockFall = currentTime
}

export function activeBlockFunc()
{
    if(activeBlock)
        {
            activeBlock = false
        }
    else
        {
            activeBlock = true
        }
}

window.addEventListener('load', () =>
{
    spawn()

    setTimeout(window.requestAnimationFrame(main), 2000)
})

// spawn new tetromino

export function spawn()
{
    newActiveTetromino()
    if (check("new"))
    {
        activeBlock = true
        drawActive()
    }
    else
    {
        gameOver()
    }
}

// choose new random tetromino

// reference to tetromino in tetrominoes.js is stored in activeTetromino

function newActiveTetromino()
{
    const num = Math.floor(Math.random() * 7 )
    activeTetromino = tetrominoes[num]
    
    // reset all positional values to their original values
    for (let key in activeTetromino)
        {
            key = parseInt(key)
            if (!isNaN(key))
            {
                for (let i = 0; i <= 3; i++)
                    {
                        activeTetromino[key][i].x = activeTetromino["spawn"][key][i].x
                        activeTetromino[key][i].y = activeTetromino["spawn"][key][i].y
                    }
            }
        }
}

// game over

function gameOver()
{
    if (confirm("Game over. Do you want to play again?"))
    {
        window.location.assign('/')
    }
}

// check new tetromino position is free

function check(direction)
{
    switch (direction)
    {
        case "new":
            return activeTetromino[0].every(coordinate=>{ return blocks[coordinate.y - 1][coordinate.x - 1].isOccupied === false }) 

        case "down":
            return activeTetromino[activeTetromino.current_rotation].every(coordinate=>{
                if (blocks[coordinate.y] === undefined || blocks[coordinate.y][coordinate.x - 1] === undefined)
                    {
                        return false
                    }
                return blocks[coordinate.y][coordinate.x - 1].isOccupied === false
            })

        case "left":
            return activeTetromino[activeTetromino.current_rotation].every(coordinate=>{
                if (blocks[coordinate.y - 1] === undefined || blocks[coordinate.y - 1][coordinate.x - 2] === undefined)
                    {
                        return false
                    }
                return blocks[coordinate.y - 1][coordinate.x - 2].isOccupied === false
            })

        case "right":
            return activeTetromino[activeTetromino.current_rotation].every(coordinate=>{
                if (blocks[coordinate.y - 1] === undefined || blocks[coordinate.y - 1][coordinate.x] === undefined)
                    {
                        return false
                    }
                return blocks[coordinate.y - 1][coordinate.x].isOccupied === false
            })

        case 0:
        case 1:
        case 2:
        case 3:
            return activeTetromino[direction].every(coordinate=>{
                if (blocks[coordinate.y - 1] === undefined || blocks[coordinate.y - 1][coordinate.x - 1] === undefined)
                    {
                        return false
                    }
                return blocks[coordinate.y - 1][coordinate.x - 1].isOccupied === false
            })

    }
}


// draw the active tetromino

function drawActive()
{
    document.querySelectorAll('.active').forEach(element=>
    {
        element.remove()
    })

    activeTetromino[activeTetromino.current_rotation].forEach(coordinate=>
    {
        const element = document.createElement('div')
        element.classList.add(activeTetromino.color, "active")
        element.style.gridRowStart = coordinate.y
        element.style.gridColumnStart = coordinate.x
        document.getElementById('game-board').appendChild(element)
    })
}

// draw game board after tetromino piece has fallen to ground

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

// MOVEMENT

function moveDown()
{
    if (!activeBlock) return

    if (check("down"))
    {
        for (let key in activeTetromino)
        {
            key = parseInt(key)
            if (!isNaN(key))
            {
                activeTetromino[key].forEach(coordinate=>
                {
                    coordinate.y++
                })
            }
        }
        drawActive()
    }
    else
    {
        addBlocks()
    }

}

// move active tetromino left by one

function moveLeft()
{
    if (!activeBlock) return
   
    if (check("left"))
    {
        for (let key in activeTetromino)
        {
            key = parseInt(key)
            if (!isNaN(key))
            {
                activeTetromino[key].forEach(coordinate=>
                {
                    coordinate.x--
                })
            }
        }
        drawActive()
    }

}

// move active tetromino right by one

function moveRight()
{
    if (!activeBlock) return

    if (check("right"))
    {
        for (let key in activeTetromino)
        {
            key = parseInt(key)
            if (!isNaN(key))
            {
                activeTetromino[key].forEach(coordinate=>
                {
                    coordinate.x++
                })
            }
        }
        drawActive()
   
    }

}

// rotate clockwise

function clockwise()
{
    if (!activeBlock) return
    switch(activeTetromino.color)
    {
        case "cyan":
        case "green":
        case "red":
            if (activeTetromino.current_rotation === 1)
            {
                if (check(0))
                {
                    activeTetromino.current_rotation = 0
                    drawActive()
                }
            }
            else
            {
                if (check(activeTetromino.current_rotation + 1))
                {
                    activeTetromino.current_rotation++
                    drawActive()
                }
            }
            break

        case "blue":
        case "purple":
        case "orange":
            if (activeTetromino.current_rotation === 3)
            {
                if (check(0))
                {
                    activeTetromino.current_rotation = 0
                    drawActive()
                }
            }
            else
            {
                if (check(activeTetromino.current_rotation + 1))
                {
                    activeTetromino.current_rotation++
                    drawActive()
                }
            }
            break

        case "yellow":
            break
    }
}

//rotate counter-clockwise

function counterClockwise()
{
    if (!activeBlock) return
    switch(activeTetromino.color)
    {
        case "cyan":
        case "green":
        case "red":
            if (activeTetromino.current_rotation === 0)
            {
                if (check(1))
                {
                activeTetromino.current_rotation = 1
                drawActive()
                }
            }
            else
            {
                if (activeTetromino.current_rotation - 1)
                {
                activeTetromino.current_rotation--
                drawActive()
                }
            }
            break

        case "blue":
        case "purple":
        case "orange":
            if (activeTetromino.current_rotation === 0)
            {
                if (check(3))
                {
                activeTetromino.current_rotation = 3
                drawActive()
                }
            }
            else
            {
                if (activeTetromino.current_rotation - 1)
                {
                activeTetromino.current_rotation--
                drawActive()
                }
            }
            break

        case "yellow":
            break
    }
}

// hard drop

function hardDrop()
{
    let drop = 1
    while (true)
        {
            if ( 
                    activeTetromino[activeTetromino.current_rotation].every(coordinate=>{
                    if (blocks[coordinate.y - 1 + drop] === undefined || blocks[coordinate.y - 1 + drop][coordinate.x - 1] === undefined)
                        {
                            return false
                        }
                    return blocks[coordinate.y - 1 + drop][coordinate.x - 1].isOccupied === false
                    })
                )
                {
                    drop++
                    continue
                }
            else
                {
                    drop--
                    break
                }
        }
        activeTetromino[activeTetromino.current_rotation].forEach(coordinate=>{
            coordinate.y += drop
        })
        drawActive()
        addBlocks()

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
            moveLeft()
            break

        case "ArrowRight":
           moveRight()
            break

        case "ArrowDown":
            moveDown()
            lastBlockFall = time
            break
    }
})

