
import { tetrominoes, I_shape, L_shape, J_shape, O_shape, S_shape, Z_shape, T_shape } from "./tetrominoes.js"
import { blocks, deleteBlocks } from "./blocks.js"
import { addBlocks } from "./blocks.js"
import { gameSpeed, changeLevel, changeGameSpeed } from "./score.js"

// TODO: 

//today: hi score, level setter. game over screen
//hi score stored in cookie. flashes when new high score acheived. 
// level setter - up level, "level", down level - number across from word
// game over screen = words, game over, below, score. below that, play again button. takes you to start screen
//tomorrow:aesthetics. make look pretty. clean up code (ie move movement/input to separate module)

let lastBlockFall = 0
export let activeTetromino
let nextTetromino = null
let activeBlock = false
let time
let animationID
let gameStarted = false
let optionsMenuSelected = false
let musicOn = false
let newGameLevel = 1
document.getElementById("new-game").addEventListener('click', startGame);
document.getElementById("continue").addEventListener('click', continueGame);
document.getElementById("options-button").addEventListener('click', optionsMenu);
document.getElementById("back").addEventListener('click', optionsMenu);
document.getElementById("music").addEventListener('click', toggleMusic);
document.getElementById("level-up").addEventListener('mousedown', levelOption);
document.getElementById("level-down").addEventListener('mousedown', levelOption);

function main(currentTime) 
{
    animationID = window.requestAnimationFrame(main)
    time = currentTime
    if (lastBlockFall === 0) lastBlockFall = time
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

// spawn new tetromino

export function spawn()
{
    newActiveTetromino()
    if (check("new"))
    {
        activeBlock = true
        drawNextTetromino()
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
    let num = Math.floor(Math.random() * 7 )
    if(!nextTetromino)
        {
            nextTetromino = tetrominoes[num]
            num = Math.floor(Math.random() * 7 )
            activeTetromino = tetrominoes[num]
        }
    else
        {
            activeTetromino = nextTetromino
            nextTetromino = tetrominoes[num]
        }
    
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

function drawNextTetromino()
{
    document.getElementById("next-piece").innerHTML = "";
    const width = document.getElementById("game-board").scrollWidth / 10;
    const container = document.createElement("div");
    container.style.display="grid";
    switch (nextTetromino.color)
        {
            case "cyan":
                container.style.gridTemplateColumns = width + "px" + " " + width + "px" + " " + width + "px" + " " + width + "px";
                container.style.gridTemplateRows = width + "px";
                nextTetromino["spawn"][0].forEach(coordinate=>
                    {
                        const element = document.createElement('div')
                        element.style.gridRowStart = coordinate.y
                        element.style.gridColumnStart = coordinate.x - 3
                        element.classList.add(nextTetromino.color)
                        container.appendChild(element)
                    })
                document.getElementById("next-piece").appendChild(container)
                break

            case "yellow":
                container.style.gridTemplateColumns = width + "px" + " " + width + "px";
                container.style.gridTemplateRows = width + "px" + " " + width + "px";
                nextTetromino["spawn"][0].forEach(coordinate=>
                    {
                        const element = document.createElement('div')
                        element.style.gridRowStart = coordinate.y
                        element.style.gridColumnStart = coordinate.x - 4
                        element.classList.add(nextTetromino.color)
                        container.appendChild(element)
                    })
                document.getElementById("next-piece").appendChild(container)
                break

            case "blue":
            case "orange":
            case "green":
            case "purple":
            case "red":
                container.style.gridTemplateColumns = width + "px" + " " + width + "px" + " " + width + "px";
                container.style.gridTemplateRows = width + "px" + " " + width + "px";
                nextTetromino["spawn"][0].forEach(coordinate=>
                    {
                        const element = document.createElement('div')
                        element.style.gridRowStart = coordinate.y
                        element.style.gridColumnStart = coordinate.x - 3
                        element.classList.add(nextTetromino.color)
                        container.appendChild(element)
                    })
                document.getElementById("next-piece").appendChild(container)
                break
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

// pause game

function pauseMenu()
{
    document.getElementById("pause").style.display = "flex";
    window.cancelAnimationFrame(animationID);
}

function optionsMenu()
{
    if(!optionsMenuSelected)
        {
            optionsMenuSelected = true;
            document.getElementById("pause").style.display = "none";
            document.getElementById("options").style.display = "flex";
        }
    else
        {
            optionsMenuSelected = false;
            document.getElementById("options").style.display = "none";
            document.getElementById("pause").style.display = "flex";
        }
    
}

function toggleMusic()
{
    if(!musicOn)
        {
            musicOn = true;
            document.getElementById("music-off").style.fontSize = "20px";
            document.getElementById("music-on").style.fontSize = "30px";
            document.querySelector("audio").play();
        }
    else
        {
            musicOn = false;
            document.getElementById("music-off").style.fontSize = "30px";
            document.getElementById("music-on").style.fontSize = "20px";
            document.querySelector("audio").pause();
        }
}

function levelOption(event)
{
  //  event.target.style.fontSize="25px";
 //   event.target.addEventListener('mouseup', levelUnclick(event.target));
 //   event.target.addEventListener('mouseleave', levelUnclick(event.target));
    if(event.target.id === "level-up") 
        { 
         //   event.target.style.marginBottom="6px";
            if(newGameLevel < 9)
                {
                    newGameLevel++;
                    document.getElementById("level-counter").innerHTML = newGameLevel;
                }
        }
    else if (event.target.id === "level-down")
        {
            if(newGameLevel > 1)
                {
                    newGameLevel--;
                    document.getElementById("level-counter").innerHTML = newGameLevel;
                }
        }

}

function levelUnclick(element)
{
    element.style.fontSize="30px";
    if(element.id === "level-up") { element.style.marginBottom="0px" };
    element.removeEventListener('mouseup', levelUnclick);
    element.removeEventListener('mouseleave', levelUnclick);
}

// start game

function startGame()
{
    if(gameStarted)
        {
            deleteBlocks([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]);
            drawBlocks();
            document.getElementById("pause").style.display = "none";
            lastBlockFall = 0;
            nextTetromino = null;
            if (newGameLevel != 1)
                {
                    changeLevel(newGameLevel);
                    document.getElementById("level").innerHTML = newGameLevel;
                    changeGameSpeed(800 * (0.9 ** newGameLevel));
                }
            spawn();
            animationID = window.requestAnimationFrame(main);
            return
        }
    document.getElementById("pause").style.display = "none";
    document.getElementById("continue").style.display = "block";
    if (newGameLevel != 1)
        {
            changeLevel(newGameLevel);
            document.getElementById("level").innerHTML = newGameLevel;
            changeGameSpeed(800 * (0.9 ** newGameLevel));
        }
    spawn();
    gameStarted = true;
    animationID = window.requestAnimationFrame(main);
}

// continue game

function continueGame()
{
    document.getElementById("pause").style.display = "none";
    animationID = window.requestAnimationFrame(main);
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
            elsecheck
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
        
        case "p":
        case "Escape":
            pauseMenu()
    }
})

