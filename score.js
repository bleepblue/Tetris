let level = 1
let lines = 0
export let score = 0
export let gameSpeed = 800
export function linesCleared(rows)
{
    switch(rows.length)
    {
        case 1:
            lines +=1
            score += 100 * level
            document.getElementById("score").innerHTML = score;
            break
        case 2:
            lines +=2
            score += 300 * level
            document.getElementById("score").innerHTML = score;
            break
        case 3:
            lines += 2
            score += 500 * level
            document.getElementById("score").innerHTML = score;
            break
        case 4:
            lines += 4
            score += 800 * level
            document.getElementById("score").innerHTML = score;
            break
    }

    if (lines >= 10)
    {
        level++
        console.log(level)
        document.getElementById("level").innerHTML = level;
        lines -= 10
        gameSpeed *= 0.9
    }
}

export function changeLevel(newLevel)
{
    level = newLevel
}

export function changeGameSpeed(newSpeed)
{
    gameSpeed = newSpeed
}




