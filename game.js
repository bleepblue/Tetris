
import { tetrominoes, ghost_piece } from "./tetrominoes.js"
import { blocks, deleteBlocks, addBlocks } from "./blocks.js"
import { gameSpeed, changeLevel, changeGameSpeed, score, resetScore } from "./score.js"



// event listener on load and and resize. check if width is less than 100vh. remove and recreate hold on the right if so. move gameboard to the far left.
// media query for menu items, if they get fucked up make it all smaller

// move code to correct modules
// clean up code where possible...
// is active block pointless now?

// need to calibrate animation timings to screen size
// make tetrominoes 3D?


let lastBlockFall = 0
export let activeTetromino
let nextTetromino = null
let holdBlock = null
let activeBlock = false
let placementToggle = "left"
let time
let lastAnimationBlockSpawn = 0
let animationID
let intervalID
let intervalIDDown
let intervalIDLeft
let intervalIDRight
let backgroundAnimationID
let gameStarted = false
let musicOn = false
let backgroundOn = true
let newGameLevel = 1
let highScore = 0
let gameOverScreen = false
let pauseMenuScreen = false
let controlsMenuOpen = false
let keyPressed
let controlSelected
let customControlMenu = false
let optionsMenuOpen = false
let ghostPieceActive = true
let sideWidth = document.querySelector(".blank").scrollWidth; 
let blockWidth = document.getElementById("game-board").scrollWidth / 10;
let animationLength = Math.floor(sideWidth / (blockWidth * 2));
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
window.addEventListener('resize', ()=>{
    window.cancelAnimationFrame(backgroundAnimationID);
    document.querySelectorAll(".animation-container").forEach(element=>{element.remove()});
    lastAnimationBlockSpawn = 0;
    placementSetup();
    backgroundAnimationID = window.requestAnimationFrame(backgroundAnimation);
})


window.addEventListener('animationend', (e)=>{
   
    if(e.animationName == "fadeOut")
        {
            e.target.remove()
        }
    
        
    
});





const placement = 
{
    left:
    {
        currentPlacement: undefined,
        placementArray: [],
        currentPlacementArray: []
    },
    right:
    {
        currentPlacement: undefined,
        placementArray: [],
        currentPlacementArray: []
    }
}

//animationSetup();
placementSetup();

window.addEventListener('load', placementSetup);
backgroundAnimationID = window.requestAnimationFrame(backgroundAnimation);

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
        document.getElementById("next-piece").innerHTML = "";
        const container = document.createElement("div");
        drawNonGameTetromino(container, nextTetromino, 0);
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

function drawNonGameTetromino(container, tetromino, rotation)
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
                                element.style.gridColumnStart = coordinate.x - 4
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



function backgroundAnimation(currentTime)
{
    backgroundAnimationID = window.requestAnimationFrame(backgroundAnimation);
    if(!lastAnimationBlockSpawn)
        {
            lastAnimationBlockSpawn = currentTime
        }
    if((currentTime - lastAnimationBlockSpawn) >  200)
        {
            lastAnimationBlockSpawn = currentTime;
            spawnNewBackgroundPiece(placementToggle);
            placementToggle === "right" ? placementToggle = "left" : placementToggle = "right";
        } 
}

function spawnNewBackgroundPiece(side)
{
    const container = document.createElement("div");
    container.classList.add("animation-container");
    container.style[side] = setPlacement(side);
    container.style.height = "100vh";
    const tail = document.createElement("div");
    tail.className = "tail";
    const gridContainer = document.createElement("div");
    gridContainer.style.opacity = "0.5";
    const newPiece = tetrominoes[Math.floor(Math.random() * 7)];
    if(newPiece.color == "cyan") lastAnimationBlockSpawn += 120;
    drawNonGameTetromino(gridContainer, newPiece, 1);
    container.appendChild(tail);
    container.appendChild(gridContainer);

    switch(newPiece.color)
    {
        case "cyan": 
                tail.style.bottom = `-${blockWidth + 10}px`;
                container.classList.add("animation4Block");
                break

            
        case "yellow":
                tail.style.bottom = `-${blockWidth + 10}px`;
                container.classList.add("animation2Block");
                break

            
        case "blue":
        case "orange":
                tail.style.bottom = `-${blockWidth * 2.5 + 10}px`;
                container.classList.add("animation3Block");
                break
            
        case "green":
        case "purple":
        case "red":
                tail.style.bottom = `-${blockWidth * 1.5 + 10}px`;
                container.classList.add("animation3Block");
                break
    }



    document.querySelector('body').appendChild(container);

}
    
function placementSetup()
    {
        animationLength = Math.round(sideWidth / (blockWidth * 2));
      //  animationSetup();
        sideWidth = document.querySelector(".blank").scrollWidth; 
        blockWidth = document.getElementById("game-board").scrollWidth / 10;
        let spacing = 1; 
        for(let i = 0; i < animationLength; i++)
            {
                placement.left.placementArray[i] = spacing + "px";
                placement.left.currentPlacementArray[i] = i;
                placement.right.placementArray[i] = spacing + "px";
                placement.right.currentPlacementArray[i] = i;
                spacing += parseInt(blockWidth * 2);
            }

            
    }

    //the actual placement
function setPlacement(side)
{
    let index = Math.floor(Math.random() * placement[side].currentPlacementArray.length);
    placement[side].currentPlacement = placement[side].currentPlacementArray[index];
    placement[side].currentPlacementArray.splice(index, 1);
    if(placement[side].currentPlacementArray.length == 1)
        {
            for(let i = 0; i < animationLength; i++)
                {
                    placement[side].currentPlacementArray[i] = i;
                    
                }
            placement[side].currentPlacementArray.splice(placement[side].currentPlacement, 1);
            
        }
  
        
    return placement[side].placementArray[placement[side].currentPlacement];
}

    


function flash()
{
     document.querySelector(".flash-high-score").classList.toggle("flash")
}

function gameOver()
{
    if(gameOverScreen)
        {
            return
        }   
    gameOverScreen = true;
    window.cancelAnimationFrame(animationID);
    document.getElementById("continue").style.display = "none";
    document.getElementById("pause").style.display = "flex";
    let element = document.createElement("div");
    element.className="game-over-score";
    if (score > highScore)
        {
            highScore = score;
            element.innerHTML = `<span class='flash-high-score'>New High Score!</span> <br> ${highScore}`;
            document.getElementById("high-score").innerHTML = highScore;
            document.cookie = `highScore=${highScore};max-age=2678400;path=/`;
            document.getElementById("continue").after(element);
            intervalID = setInterval(flash, 250);
        }
    else
        {
            element.innerHTML = `score <br> ${score}`
            document.getElementById("continue").after(element);
        }
}

// pause game

function pauseMenu()
{
    if(pauseMenuScreen)
        {
            continueGame();
            return
        }
    pauseMenuScreen = true;
    document.getElementById("pause").style.display = "flex";
    window.cancelAnimationFrame(animationID);
}

function controlsMenu()
{
    controlsMenuOpen = true;
    document.getElementById("pause").style.display = "none";
    document.getElementById("controls").style.display = "flex";
}

function backButton()
{
    optionsMenuOpen = false;
    controlsMenuOpen = false;
    document.getElementById("options").style.display = "none";
    document.getElementById("controls").style.display = "none";
    document.getElementById("pause").style.display = "flex";
}



function optionsMenu()
{
    optionsMenuOpen = true;
    document.getElementById("pause").style.display = "none";
    document.getElementById("options").style.display = "flex";
    if(gameOverScreen)
        {
            clearInterval(intervalID);
            document.querySelector(".game-over-score").remove();
        }
}


function checkHighScore()
{
    let scoreCookie = document.cookie;
    if(scoreCookie)
        {
            let cookieArray = scoreCookie.split("=");
            highScore = parseInt(cookieArray[1]);
            document.getElementById("high-score").innerHTML = highScore;
        }
}

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

function toggleGhost()
{
    if(ghostPieceActive)
        {
            ghostPieceActive = false;
            document.getElementById("ghost-on").style.fontSize = "20px";
            document.getElementById("ghost-off").style.fontSize = "30px";
        }
    else
        {
            ghostPieceActive = true;
            document.getElementById("ghost-on").style.fontSize = "30px";
            document.getElementById("ghost-off").style.fontSize = "20px";
        }
}

function levelOption(event)
{
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

function toggleBackground()
{
    if(backgroundOn)
        {
            backgroundOn = false;
            window.cancelAnimationFrame(backgroundAnimationID);
            document.querySelectorAll(".animation-container").forEach(element=>{element.remove()});
            lastAnimationBlockSpawn = 0;
            document.getElementById("background-on").style.fontSize = "20px";
            document.getElementById("background-off").style.fontSize = "30px";
        }
    else
        {
            
            backgroundOn = true;
            placementSetup();
            backgroundAnimationID = window.requestAnimationFrame(backgroundAnimation);
            document.getElementById("background-on").style.fontSize = "30px";
            document.getElementById("background-off").style.fontSize = "20px";

        }
}

// start game

function startGame()
{
    pauseMenuScreen = false;
    resetScore();
    if(gameStarted)
        {
            if(gameOverScreen)
                {
                    gameOverScreen = false;
                    clearInterval(intervalID);
                    if(document.querySelector(".game-over-score"))
                        {
                            document.querySelector(".game-over-score").remove();
                        }
                }
            deleteBlocks([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19]);
            drawBlocks();
            document.getElementById("pause").style.display = "none";
            document.getElementById("hold").innerHTML = "";
            holdBlock = null;
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
    if(!document.querySelector(".ghost"))
        {
            if(ghostPieceActive)
                {
                    ghostPiece()
                }
        }
    else if(!ghostPieceActive)
        {
            document.querySelectorAll(".ghost").forEach(node=>
                {
                    node.remove()
                })
            document.querySelectorAll(".ghost-overlap").forEach(node=>
                {
                    node.remove()
                })
        }
    pauseMenuScreen = false;
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
        
        case "left2":
            return activeTetromino[activeTetromino.current_rotation].every(coordinate=>{
                
                return blocks[coordinate.y - 1][coordinate.x - 3].isOccupied === false
            })

        case "right":
            return activeTetromino[activeTetromino.current_rotation].every(coordinate=>{
                if (blocks[coordinate.y - 1] === undefined || blocks[coordinate.y - 1][coordinate.x] === undefined)
                    {
                        return false
                    }
                return blocks[coordinate.y - 1][coordinate.x].isOccupied === false
            })

        case "right2":
            return activeTetromino[activeTetromino.current_rotation].every(coordinate=>{
                
                return blocks[coordinate.y - 1][coordinate.x + 1].isOccupied === false
            })

        case 0:
        case 1:
        case 2:
        case 3:
            return activeTetromino[direction].every(coordinate=>{
                if (blocks[coordinate.y - 1] === undefined || blocks[coordinate.y - 1][coordinate.x - 1] === undefined)
                    {
                        wallKick(direction)
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

function ghostPiece()
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

function hold ()
{
    if (!holdBlock)
        {
            activeTetromino.current_rotation = 0;
            holdBlock = activeTetromino;
            document.getElementById("hold").innerHTML = "";
            const container = document.createElement("div");
            drawNonGameTetromino(container, holdBlock, 0);
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
            activeTetromino = holdBlock;
            holdBlock = temp;
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
                drawNonGameTetromino(container, holdBlock, 0);
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
        clearInterval(intervalIDLeft)
        clearInterval(intervalIDRight)
        clearInterval(intervalIDDown)
    }
    lastBlockFall = time

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
        ghostPiece()
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
        ghostPiece()
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
                    ghostPiece()
                }
            }
            else
            {
                if (check(activeTetromino.current_rotation + 1))
                {
                    activeTetromino.current_rotation++
                    drawActive()
                    ghostPiece()
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
                    ghostPiece()
                }
            }
            else
            {
                if (check(activeTetromino.current_rotation + 1))
                {
                    activeTetromino.current_rotation++
                    drawActive()
                    ghostPiece()
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
                ghostPiece()
                }
            }
            else
            {
                if (check(activeTetromino.current_rotation - 1))
                {
                activeTetromino.current_rotation--
                drawActive()
                ghostPiece()
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
                ghostPiece()
                }
            }
            else
            {
                if (check(activeTetromino.current_rotation - 1))
                {
                activeTetromino.current_rotation--
                drawActive()
                ghostPiece()
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
    if(ghostPieceActive)
        {
            let i = 0;
            activeTetromino[activeTetromino.current_rotation].forEach(coordinate=>
                {
                    coordinate.x = ghost_piece[i].x;
                    coordinate.y = ghost_piece[i].y;
                    i++;
                })
            document.querySelectorAll(".ghost").forEach(node=>
                {
                    node.remove()
                })
            document.querySelectorAll(".ghost-overlap").forEach(node=>
                {
                    node.remove()
                })
            drawActive()
            addBlocks()
            clearInterval(intervalIDLeft)
            clearInterval(intervalIDRight)
            clearInterval(intervalIDDown)
        }
    else
        {
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
                activeTetromino[activeTetromino.current_rotation].forEach(coordinate=>{
                    coordinate.y += drop
                })
                drawActive()
                addBlocks()
                clearInterval(intervalIDLeft)
                clearInterval(intervalIDRight)
                clearInterval(intervalIDDown)    
        }

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
    if(!gameStarted)
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

function wallKick(direction)
{
    let xValues = Array()
    activeTetromino[activeTetromino.current_rotation].forEach(coordinate=>{
        xValues.push(coordinate.x)
    });
    if(Math.min(...xValues) == 1)
        {
            if (!check("right")) return
                
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
            if(check(direction))
                {
                    activeTetromino.current_rotation = direction;
                    drawActive()
                    ghostPiece()
                }
            else
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
                }
                
        }
    else if(Math.max(...xValues) == 10)
        {
            if(activeTetromino.color == "cyan")
                {
                    if(!check("left2")) return

                    for (let key in activeTetromino)
                        {
                            key = parseInt(key)
                            if (!isNaN(key))
                            {
                                activeTetromino[key].forEach(coordinate=>
                                {
                                    coordinate.x-=2
                                })
                            }
                        }
                        if(check(direction))
                            {
                                activeTetromino.current_rotation = direction;
                                drawActive()
                                ghostPiece()
                            }
                        else
                            {
                                for (let key in activeTetromino)
                                    {
                                        key = parseInt(key)
                                        if (!isNaN(key))
                                        {
                                            activeTetromino[key].forEach(coordinate=>
                                            {
                                                coordinate.x+=2
                                            })
                                        }
                                    }
                            }
                        return
                } 
            if (!check("left")) return
            
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
            if(check(direction))
                {
                    activeTetromino.current_rotation = direction;
                    drawActive()
                    ghostPiece()
                }
            else
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
                }
                
        }
}




