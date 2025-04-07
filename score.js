let lines = 0
export const scoreValues = {
    level: 1,
    score: 0,
    gameSpeed: 800
}
export function linesCleared(rows)
{
    switch(rows.length)
    {
        case 1:
            lines +=1
            scoreValues.score += 100 * scoreValues.level
            document.getElementById("score").innerHTML = scoreValues.score;
            break
        case 2:
            lines +=2
            scoreValues.score += 300 * scoreValues.level
            document.getElementById("score").innerHTML = scoreValues.score;
            break
        case 3:
            lines += 2
            scoreValues.score += 500 * scoreValues.level
            document.getElementById("score").innerHTML = scoreValues.score;
            break
        case 4:
            lines += 4
            scoreValues.score += 800 * scoreValues.level
            document.getElementById("score").innerHTML = scoreValues.score;
            break
    }

    if (lines >= 10)
    {
        scoreValues.level++
        document.getElementById("level").innerHTML = scoreValues.level;
        lines -= 10
        scoreValues.gameSpeed *= 0.9
    }
}

