let level = 1
let lines = 0
export let gameSpeed = 500
export function linesCleared(rows)
{
    switch(rows.length)
    {
        case 1:
            lines +=1
            break
        case 2:
            lines +=3
            break
        case 3:
            lines += 5
            break
        case 4:
            lines += 8
            break
    }
    if (lines >= 10)
    {
        level++
        lines -= 10
        gameSpeed *= 1.1
    }
}

