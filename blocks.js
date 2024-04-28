let blocks = []

for (let i = 0; i < 20; i++)
{
    blocks[i] = []
    for (let j = 0; j < 10; j++)
    {
        blocks[i][j] = {isOccupied: false, color: ''}
    }
}

function checkLineCompletion ()
{
    let rows = []
    for (let i = 0; i < 20; i++)
    {
        if 
        (
                blocks[i].some(element => 
                    {
                        element.isOccupied === false
                    })
        )
        {
            continue
        }
        
        rows.push(i)
    }

    return rows
}


function deleteLines(rows)
{
    const allBlocks = document.querySelector('#game-board').childNodes
    let deleteList = []
    rows.forEach(row => {
        allBlocks.forEach(element => {
            if (parseInt(element.style.gridRowStart) == row)
            {
                deleteList.push(element)
            }
        })
    });

    let count = 0

    const intervalID = setInterval(() => {
        deleteList.forEach(item=>{
            item.classList.add('white')
        })
        setTimeout(() => {
            deleteList.forEach(item=>{
                item.classList.remove('white')
            })
        }, 150)
        count++
    }, 300)

    while(count < 3)
    {
        continue
    }
    clearInterval(intervalID)

    x


}




/* module containing 2-dimensional array, filled with objects.
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
                    check if isOccupied, and if it is, access object in row i minus {number of lines deleted variable}, column j, and set it to isOccupied: true, color: {color of current object}, and set isOccupied of current object to false.*/
