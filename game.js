
let lastBlockFall = 0
let gameSpeed = 1

function main(currentTime) 
{
    window.requestAnimationFrame(main)
    if (input)
    if ((currentTime - lastRender) / 1000 < 1 / gameSpeed) return
    console.log("tetromino goes down")    
    lastBlockFall = currentTime
    

}

window.requestAnimationFrame(main)




function 
/* game update logic

game redraws at regular intervals (for gravity) OR after input (that is not blocked)
also redraws after line deletion in blocks module
only active piece is redrawn

*/

/* must remake tetrminoes module - 0 is spawn co ordinates (on real grid) and the other positions are relative to spawn position
   every time the tetromino moves, all its co ordinates are updated. what is drawn is whatever the current position is. 
   obviously will have to check that move is possible first.
   copy object from module into new 'active' object in this module.
   the function that checks if the move is possible calls the 'add block' function in blocks module if 
   gravity or hard drop or soft drop caused the active block to be blocked by the blocks. 
   then the active block is deleted and a new block is spawned.
*/


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


