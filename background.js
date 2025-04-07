import { drawNonGameTetromino, blockWidth } from "./game.js"
import { tetrominoes } from "./tetrominoes.js"
let placementToggle = "left"
let sideWidth = document.querySelector(".blank").scrollWidth 
let animationLength
export const backgroundValues = {
    lastAnimationBlockSpawn: 0,
    backgroundAnimationID: null
}

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

export function backgroundAnimation(currentTime)
{
    backgroundValues.backgroundAnimationID = window.requestAnimationFrame(backgroundAnimation);
    if(!backgroundValues.lastAnimationBlockSpawn)
        {
            backgroundValues.lastAnimationBlockSpawn = currentTime
        }
    if((currentTime - backgroundValues.lastAnimationBlockSpawn) >  200)
        {
            backgroundValues.lastAnimationBlockSpawn = currentTime;
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
    if(newPiece.color == "cyan") backgroundValues.lastAnimationBlockSpawn += 120;
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
    
export function placementSetup()
    {
        animationLength = Math.round(sideWidth / (blockWidth * 2));
        sideWidth = document.querySelector(".blank").scrollWidth; 
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

