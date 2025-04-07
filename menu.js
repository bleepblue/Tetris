import { scoreValues } from "./score.js"
import { backgroundValues } from "./background.js"
import { values, spawn, drawBlocks, main } from "./game.js"
import { deleteBlocks } from "./blocks.js"
let musicOn = false
let backgroundOn = true
export let optionsMenuOpen = false
export let controlsMenuOpen = false
export let ghostPieceActive = true
let newGameLevel = 1
let highScore = 0
export let gameOverScreen = false
export let pauseMenuScreen = false
let intervalID
export const menuValues =
{
    animationID: null
} 




export function pauseMenu()
{
    if(pauseMenuScreen)
        {
            continueGame();
            return
        }
    pauseMenuScreen = true;
    document.getElementById("pause").style.display = "flex";
    window.cancelAnimationFrame(menuValues.animationID);
}

export function controlsMenu()
{
    controlsMenuOpen = true;
    document.getElementById("pause").style.display = "none";
    document.getElementById("controls").style.display = "flex";
}

export function backButton()
{
    optionsMenuOpen = false;
    controlsMenuOpen = false;
    document.getElementById("options").style.display = "none";
    document.getElementById("controls").style.display = "none";
    document.getElementById("pause").style.display = "flex";
}



export function optionsMenu()
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

export function toggleMusic()
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

export function toggleGhost()
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

export function levelOption(event)
{
    if(event.target.id === "level-up") 
        { 
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

export function toggleBackground()
{
    if(backgroundOn)
        {
            backgroundOn = false;
            window.cancelAnimationFrame(backgroundValues.backgroundAnimationID);
            document.querySelectorAll(".animation-container").forEach(element=>{element.remove()});
            lastAnimationBlockSpawn = 0;
            document.getElementById("background-on").style.fontSize = "20px";
            document.getElementById("background-off").style.fontSize = "30px";
        }
    else
        {
            
            backgroundOn = true;
            placementSetup();
            backgroundValues.backgroundAnimationID = window.requestAnimationFrame(backgroundAnimation);
            document.getElementById("background-on").style.fontSize = "30px";
            document.getElementById("background-off").style.fontSize = "20px";

        }
}

export function continueGame()
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
    menuValues.animationID = window.requestAnimationFrame(main);
}

export function checkHighScore()
{
    let scoreCookie = document.cookie;
    if(scoreCookie)
        {
            let cookieArray = scoreCookie.split("=");
            highScore = parseInt(cookieArray[1]);
            document.getElementById("high-score").innerHTML = highScore;
        }
}

export function startGame()
{
    pauseMenuScreen = false;
    scoreValues.score = 0;
    document.getElementById("score").innerHTML=0;
    if(values.gameStarted)
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
            values.holdBlock = null;
            values.lastBlockFall = 0;
            values.nextTetromino = null;
            if (newGameLevel != 1)
                {
                    scoreValues.level = newGameLevel;
                    document.getElementById("level").innerHTML = newGameLevel;
                    scoreValues.gameSpeed = 800 * (0.9 ** newGameLevel)
                }
            spawn();
            menuValues.animationID = window.requestAnimationFrame(main);
            return
        }
    document.getElementById("pause").style.display = "none";
    document.getElementById("continue").style.display = "block";
    if (newGameLevel != 1)
        {
            scoreValues.level = newGameLevel;
            document.getElementById("level").innerHTML = newGameLevel;
            Values.gameSpeed = 800 * (0.9 ** newGameLevel)
        }
    spawn();
    values.gameStarted = true;
    menuValues.animationID = window.requestAnimationFrame(main);
}

export function gameOver()
{
    if(gameOverScreen)
        {
            return
        }   
    gameOverScreen = true;
    window.cancelAnimationFrame(menuValues.animationID);
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
            intervalID = setInterval(()=>{document.querySelector(".flash-high-score").classList.toggle("flash")}, 250);
        }
    else
        {
            element.innerHTML = `score <br> ${scoreValues.score}`
            document.getElementById("continue").after(element);
        }
}
