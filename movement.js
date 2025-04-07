
import { activeTetromino, drawActive, ghostPiece, intervalIDDown, intervalIDLeft, intervalIDRight, values, time } from "./game.js"
import { addBlocks, blocks } from "./blocks.js"
import { ghostPieceActive } from "./menu.js"
import { ghost_piece } from "./tetrominoes.js"

export function moveDown()
{
    if (!values.activeBlock) return

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
    values.lastBlockFall = time

}

// move active tetromino left by one

export function moveLeft()
{
    if (!values.activeBlock) return
   
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

export function moveRight()
{
    if (!values.activeBlock) return

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

export function clockwise()
{
    if (!values.activeBlock) return
    if (activeTetromino.color == "yellow") return

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
}

//rotate counter-clockwise

export function counterClockwise()
{
    if (!values.activeBlock) return
    if (activeTetromino.color == "yellow") return

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

}

// hard drop

export function hardDrop()
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

export function check(direction)
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
