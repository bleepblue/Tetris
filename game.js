
import { tetrominoes, ghost_piece } from "./tetrominoes.js"
import { blocks } from "./blocks.js"
import { scoreValues } from "./score.js"
import { continueGame, controlsMenuOpen, optionsMenuOpen, checkHighScore, toggleBackground, levelOption, toggleGhost, toggleMusic, optionsMenu, backButton, controlsMenu, pauseMenuScreen, gameOverScreen, ghostPieceActive, gameOver, startGame, menuValues, pauseMenu } from "./menu.js"
import { backgroundValues, placementSetup, backgroundAnimation } from "./background.js"
import { moveLeft, moveDown, moveRight, check, clockwise, counterClockwise, hardDrop } from "./movement.js"



// event listener on load and and resize. check if width is less than 100vh. remove and recreate hold on the right if so. move gameboard to the far left.
// media query for menu items, if they get fucked up make it all smaller

// move code to correct modules
// clean up code where possible...
// add rotations. will need to rewrite code where rotations are relevant eg check(). I, S, Z
// need to calibrate animation timings to screen size
// make tetrominoes 3D?
// turn music on initially?
// add sound effects?
// pause on resize

export let blockWidth = document.getElementById("game-board").scrollWidth / 10
export let activeTetromino
export let time
let keyPressed
let controlSelected
let customControlMenu = false
export let intervalIDDown
export let intervalIDLeft
export let intervalIDRight
export const values = 
{
    activeBlock: false,
    gameStarted: false,
    lastBlockFall: 0,
    holdBlock: null,
    nextTetromino: null
}
document.getElementById("new-game").addEventListener('click', startGame);
document.getElementById("continue").addEventListener('click', continueGame);
document.getElementById("options-button").addEventListener('click', optionsMenu);
document.getElementById("controls-button").addEventListener('click', controlsMenu);
document.querySelectorAll(".back").forEach(element=>element.addEventListener('click', backButton));
document.getElementById("music").addEventListener('click', toggleMusic);
document.getElementById("ghost-select").addEventListener('click', toggleGhost);
document.getElementById("background-select").addEventListener('click', toggleBackground);
document.getElementById("level-up").addEventListener('mousedown', levelOption);
document.getElementById("level-down").addEventListener('mousedown', levelOption);
window.addEventListener('load', checkHighScore);
window.addEventListener('load', createGameBoardBackground);
window.addEventListener('resize', resizer)
window.addEventListener('animationend', (e)=>{if(e.animationName == "fadeOut")e.target.remove()});
window.addEventListener('load', placementSetup);
backgroundValues.backgroundAnimationID = window.requestAnimationFrame(backgroundAnimation);

export function main(currentTime) 
{
    menuValues.animationID = window.requestAnimationFrame(main)
    time = currentTime
    if (values.lastBlockFall === 0) values.lastBlockFall = time
    if ((time - values.lastBlockFall) < scoreValues.gameSpeed) return
    moveDown()    
    values.lastBlockFall = currentTime
}

// spawn new tetromino

export function spawn()
{

    newActiveTetromino()
    if (check("new"))
    {
        values.activeBlock = true
        document.getElementById("next-piece").innerHTML = "";
        const container = document.createElement("div");
        drawNonGameTetromino(container, values.nextTetromino, 0);
        document.getElementById("next-piece").appendChild(container);
        drawActive();
        ghostPiece();
    }
    else
    {       
        let elevation = 0
        while(true)
        {
            if(!activeTetromino[0].every(coordinate=>{return coordinate.y - elevation >= 0}))
                {
                    break
                }
                
            if(activeTetromino[0].every(coordinate=>{
                return blocks[coordinate.y - elevation - 1] === undefined || blocks[coordinate.y - elevation - 1][coordinate.x - 1].isOccupied === false
            }))
                {
                    activeTetromino[0].forEach(coordinate=>{
                        if(blocks[coordinate.y - elevation - 1] === undefined)
                            {
                                return
                            }
                        const element = document.createElement('div')
                        const gameBoard = document.getElementById('game-board')
                        element.style.gridRowStart = coordinate.y - elevation
                        element.style.gridColumnStart = coordinate.x
                        element.classList.add(activeTetromino.color)
                        element.classList.add("block")
                        gameBoard.appendChild(element) 
                    })
                    break
                }
            else
                {
                    elevation++
                    continue
                }
                
            
        }

        gameOver()
    }
}

// choose new random tetromino

// reference to tetromino in tetrominoes.js is stored in activeTetromino

function newActiveTetromino()
{
    let num = Math.floor(Math.random() * 7 )
    if(!values.nextTetromino)
        {
            values.nextTetromino = tetrominoes[num]
            num = Math.floor(Math.random() * 7 )
            activeTetromino = tetrominoes[num]
        }
    else
        {
            activeTetromino = values.nextTetromino
            values.nextTetromino = tetrominoes[num]
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

function resizer()
{
    window.cancelAnimationFrame(backgroundAnimationID);
    document.querySelectorAll(".animation-container").forEach(element=>{element.remove()});
    lastAnimationBlockSpawn = 0;
    blockWidth = document.getElementById("game-board").scrollWidth / 10;
    placementSetup();
    backgroundValues.backgroundAnimationID = window.requestAnimationFrame(backgroundAnimation);
}

export function drawNonGameTetromino(container, tetromino, rotation)
{
    let longSide;
    let shortSide;
    if(rotation)
        {
            longSide = "gridTemplateRows";
            shortSide = "gridTemplateColumns";
            if(tetromino.color == "blue")
                {
                    rotation = 3;
                }
        }
    else
        {
            longSide = "gridTemplateColumns";
            shortSide = "gridTemplateRows";
        }
    container.style.display="grid";
    switch (tetromino.color)
        {
            case "cyan":
                container.style[longSide] = blockWidth + "px" + " " + blockWidth + "px" + " " + blockWidth + "px" + " " + blockWidth + "px";
                container.style[shortSide] = blockWidth + "px";
                container.style.gap = "1px";
                tetromino["spawn"][rotation].forEach(coordinate=>
                    {
                        const element = document.createElement('div')
                        if(rotation)
                            {
                                element.style.gridRowStart = coordinate.y
                                element.style.gridColumnStart = coordinate.x - 5
                            }
                        else
                            {
                                element.style.gridRowStart = coordinate.y -1
                                element.style.gridColumnStart = coordinate.x - 3
                            }
                        element.classList.add(tetromino.color)
                        element.style.border="2px solid white"
                        container.appendChild(element)
                    })
    
                break

            case "yellow":
                container.style[longSide] = blockWidth + "px" + " " + blockWidth + "px";
                container.style[shortSide] = blockWidth + "px" + " " + blockWidth + "px";
                container.style.gap = "1px";
                tetromino["spawn"][0].forEach(coordinate=>
                    {
                        const element = document.createElement('div')
                        element.style.gridRowStart = coordinate.y
                        element.style.gridColumnStart = coordinate.x - 4
                        element.classList.add(tetromino.color)
                        element.style.border="2px solid white"
                        container.appendChild(element)
                    })
                break

            case "blue":
            case "orange":
            case "green":
            case "purple":
            case "red":
                container.style[longSide] = blockWidth + "px" + " " + blockWidth + "px" + " " + blockWidth + "px";
                container.style[shortSide] = blockWidth + "px" + " " + blockWidth + "px";
                container.style.gap = "1px";
                tetromino["spawn"][rotation].forEach(coordinate=>
                    {
                        const element = document.createElement('div')
                        if(rotation === 1)
                            {
                                element.style.gridRowStart = coordinate.y
                                element.style.gridColumnStart = coordinate.x - 4
                            }
                        else
                            {
                                element.style.gridRowStart = coordinate.y
                                element.style.gridColumnStart = coordinate.x - 3
                            }
                        
                        element.classList.add(tetromino.color)
                        element.style.border="2px solid white"
                        container.appendChild(element)
                    })                    
                break
        }
}


// pause game




function createGameBoardBackground()
{
    const gameBoard = document.getElementById("game-board");
    for(let i = 0; i < 20; i++)
        {
            for(let j = 0; j < 10; j++)
                {
                    let element = document.createElement('div');
                    element.className = "black";
                    element.style.gridRowStart = i + 1;
                    element.style.gridColumnStart = j + 1;
                    gameBoard.appendChild(element);
                }
        }
}

// draw the active tetromino

export function drawActive()
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

export function ghostPiece()
{
    if(!ghostPieceActive)
        {
            return
        }
    document.querySelectorAll(".ghost").forEach(node=>
        {
            node.remove()
        })
    document.querySelectorAll(".ghost-overlap").forEach(node=>
        {
            node.remove()
        })
    let drop = 1
    while (true)
        {
            if ( 
                    activeTetromino[activeTetromino.current_rotation].every(coordinate=>
                        {
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
        let i = 0;
        activeTetromino[activeTetromino.current_rotation].forEach(coordinate=>
            {
                const ghost = document.createElement('div');
                const overlap = document.createElement('div');
                ghost.classList.add("ghost");
                ghost.style.gridRowStart = coordinate.y + drop;
                ghost.style.gridColumnStart = coordinate.x;
                document.getElementById('game-board').appendChild(ghost);
                overlap.classList.add("ghost-overlap");
                overlap.style.gridRowStart = coordinate.y + drop;
                overlap.style.gridColumnStart = coordinate.x;
                document.getElementById('game-board').appendChild(overlap);
                ghost_piece[i].x = coordinate.x;
                ghost_piece[i].y = coordinate.y + drop;
                i++;
            })

}

function hold()
{
    if (!values.holdBlock)
        {
            activeTetromino.current_rotation = 0;
            values.holdBlock = activeTetromino;
            document.getElementById("hold").innerHTML = "";
            const container = document.createElement("div");
            drawNonGameTetromino(container, values.holdBlock, 0);
            document.getElementById("hold").appendChild(container);
            document.querySelectorAll('.active').forEach(element=>
                {
                    element.remove()
                });
            spawn();
        }
    else
        {
            activeTetromino.current_rotation = 0;
            let temp = activeTetromino;
            activeTetromino = values.holdBlock;
            values.holdBlock = temp;
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
            if (check("new"))
            {
                document.getElementById("hold").innerHTML = "";
                const container = document.createElement("div");
                drawNonGameTetromino(container, values.holdBlock, 0);
                document.getElementById("hold").appendChild(container);
                drawActive()
                ghostPiece()
            }
            else
            {
                gameOver()
            }
            
        }
}

// draw game board after tetromino piece has fallen to ground

export function drawBlocks()
{
    const gameBoard = document.getElementById('game-board')
    const fragment = document.createDocumentFragment()
    document.querySelectorAll(".block").forEach(node=>{node.remove()})
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
                element.classList.add('block')
                fragment.appendChild(element)
            }
        }
    }
    gameBoard.appendChild(fragment)
    
}

const controls = {
    clockwise: "ArrowUp",
    anticlockwise: "z",
    down: "ArrowDown",
    left: "ArrowLeft",
    right: "ArrowRight",
    drop: " ",
    hold: "c",
    pause: "p",
    escape: "Escape",
    handleEvent(event)
        {
            if(event.type == 'click')
                {
                    document.getElementById("controls-container").style.display = "none";
                    document.querySelector("#controls>.back").style.display = "none";
                    document.getElementById("custom-controls-menu").style.display = "block";
                    controlSelected = event.target.previousElementSibling.id.split("-")[1];
                    document.getElementById("custom-controls-menu").innerHTML = `press key for ${controlSelected}`;
                    customControlMenu = true;
                }
            if(customControlMenu && event.type == 'keydown')
                {
                    if(event.key == "Escape")
                        {
                            document.getElementById("controls-container").style.display = "block";
                            document.getElementById("custom-controls-menu").style.display = "none";
                            document.querySelector("#controls>.back").style.display = "block";
                            return
                        }
                    this[controlSelected] = event.key;
                    let text;    
                    switch (event.key)
                    {
                        case "ArrowUp":
                        case "ArrowDown":
                        case "ArrowRight":
                        case "ArrowLeft":
                            text = "arrow " + event.key.slice(5).toLowerCase();
                            break
                        case " ":
                            text = "spacebar"
                            break
                        default:
                            text = event.key
                    }
                    console.log(controlSelected)
                    document.getElementById(`controls-${controlSelected}`).innerHTML = text;
                    document.getElementById("controls-container").style.display = "block";
                    document.querySelector("#controls>.back").style.display = "block";
                    document.getElementById("custom-controls-menu").style.display = "none";
                    customControlMenu = false;
                    return
                }   
            
        }

}

document.querySelectorAll(".change-control").forEach(element=>element.addEventListener('click', controls));
window.addEventListener('keydown', controls);

// INPUT

window.addEventListener('keydown', e =>
{
    if(!values.gameStarted)
        {
            return
        }
    if(gameOverScreen)
        {
            return
        }
    if(pauseMenuScreen)
        { 
            if(e.key == controls.pause)
                {
                    if(optionsMenuOpen || controlsMenuOpen)
                        {
                            backButton();
                            continueGame();
                            return
                        }
                    else
                        {
                            if(keyPressed == controls.pause) return
                            pauseMenu()
                            return
                        }
                }
            else if(e.key == controls.escape)
                {
                    if(optionsMenuOpen || controlsMenuOpen)
                        {
                            backButton();
                            return
                        }
                    else
                        {
                            if(keyPressed == controls.escape) return
                            pauseMenu()
                            return
                        }
                }
            else
                {
                    return
                }
        }
    switch(e.key)
    {
        case controls.drop:
            hardDrop()
            break

        case controls.clockwise:
            if(keyPressed == controls.clockwise || keyPressed == controls.anticlockwise) return
            clockwise()
            break

        case controls.anticlockwise:
            if(keyPressed == controls.clockwise || keyPressed == controls.anticlockwise) return
            counterClockwise()
            break
        
        case controls.left:
            clearInterval(intervalIDLeft)
            clearInterval(intervalIDRight)
            moveLeft()
            intervalIDLeft = setTimeout(()=>{
                intervalIDLeft = setInterval(moveLeft, 70)
            }, 50)
            break

        case controls.right:
            clearInterval(intervalIDLeft)
            clearInterval(intervalIDRight)
            moveRight()
            intervalIDRight = setTimeout(()=>{
                intervalIDRight = setInterval(moveRight, 70)
            }, 50)
            
            break

        case controls.down:
            if(keyPressed == controls.down) return
            moveDown()
            intervalIDDown = setTimeout(()=>{
                intervalIDDown = setInterval(moveDown, 50)
            }, 50)
            break
        
        case controls.hold:
            if(keyPressed == controls.hold) return
            hold()
            break

        case controls.pause:
        case controls.escape:
            pauseMenu()
    }
    keyPressed = e.key;

})


window.addEventListener('keyup', e =>
{
    keyPressed = null
    switch(e.key)
        {
            case controls.right:
                clearInterval(intervalIDRight)
                break
            
            case controls.left:
                clearInterval(intervalIDLeft)
                break
            
            case controls.down:
                clearInterval(intervalIDDown)
                break
        }
}
)
