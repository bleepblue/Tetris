/* each tetromino is located in 4 x 4 space, numbered 1 - 4 with the top left corner being 1,1 (as in CSS Grid). 
Each tetromino has co-ordinates for each of its four squares. Its rotational positions are marked as 0 to (potentially) 3,
with 0 representing its spawn shape, 1 being a clockwise turn from spawn and 3 a counter-clockwise turn.
Its spawn location is marked in CSS Grid co-ordinates.   */

let I_shape = 
{
    current_rotation: 0,
    spawn: [{x: 4, y: 1}, {x: 5, y: 1}, {x: 6, y: 1}, {x: 7, y: 1}],
    0: [{x: 1, y: 2}, {x: 2, y: 2}, {x: 3, y: 2}, {x: 4, y: 2}],
    1: [{x: 2, y: 1}, {x: 2, y: 2}, {x: 2, y: 3}, {x: 2, y: 4}]
}

let J_shape = 
{
    current_rotation: 0,
    spawn: [{x: 4, y: 1}, {x: 4, y: 2}, {x: 5, y: 2}, {x: 6, y: 2}],
    0: [{x: 2, y: 2}, {x: 2, y: 3}, {x: 3, y: 3}, {x: 4, y: 3}],
    1: [{x: 3, y: 2}, {x: 4, y: 2}, {x: 3, y: 3}, {x: 3, y: 4}],
    2: [{x: 2, y: 3}, {x: 3, y: 3}, {x: 4, y: 3}, {x: 4, y: 4}],
    3: [{x: 3, y: 2}, {x: 3, y: 3}, {x: 3, y: 4}, {x: 2, y: 4}]
}

let L_shape =
{
    current_rotation: 0,
    spawn: [{x: 4, y: 2}, {x: 5, y: 2}, {x: 6, y: 2}, {x: 5, y: 1}],
    0: [{x: 4, y: 2}, {x: 4, y: 3}, {x: 3, y: 3}, {x: 2, y: 3}],
    1: [{x: 3, y: 2}, {x: 3, y: 3}, {x: 3, y: 4}, {x: 4, y: 4}],
    2: [{x: 2, y: 4}, {x: 2, y: 3}, {x: 3, y: 3}, {x: 4, y: 3}],
    3: [{x: 2, y: 2}, {x: 3, y: 2}, {x: 3, y: 3}, {x: 3, y: 4}]
}

let O_shape =
{
    current_rotation: 0,
    spawn: [{x: 5, y: 1}, {x: 6, y: 1}, {x: 5, y: 2}, {x: 6, y: 2}],
    0: [{x: 2, y: 2}, {x: 3, y: 2}, {x: 2, y: 3}, {x: 3, y: 3}]
}

let S_shape = 
{
    current_rotation: 0,
    spawn: [{x: 5, y: 1}, {x: 6, y: 1}, {x: 4, y: 2}, {x: 5, y: 2}],
    0: [{x: 3, y: 2}, {x: 4, y: 2}, {x: 2, y: 3}, {x: 3, y: 3}],
    1: [{x: 2, y: 2}, {x: 2, y: 3}, {x: 3, y: 3}, {x: 3, y: 4}]
}

let T_shape = 
{
    current_rotation: 0,
    spawn: [{x: 5, y: 1}, {x: 4, y: 2}, {x: 5, y: 2}, {x: 6, y: 2}],
    0: [{x: 3, y: 2}, {x: 2, y: 3}, {x: 3, y: 3}, {x: 4, y: 3}],
    1: [{x: 3, y: 2}, {x: 3, y: 3}, {x: 3, y: 4}, {x: 4, y: 3}],
    2: [{x: 2, y: 3}, {x: 3, y: 3}, {x: 4, y: 3}, {x: 3, y: 4}],
    3: [{x: 3, y: 2}, {x: 3, y: 3}, {x: 3, y: 4}, {x: 2, y: 3}]
}

let Z_shape =
{
    current_rotation: 0,
    spawn: [{x: 4, y: 1}, {x: 5, y: 1}, {x: 5, y: 2}, {x: 6, y: 2}],
    0: [{x: 2, y: 2}, {x: 3, y: 2}, {x: 3, y: 3}, {x: 4, y: 3}],
    1: [{x: 3, y: 2}, {x: 3, y: 3}, {x: 2, y: 3}, {x: 2, y: 4}]
}