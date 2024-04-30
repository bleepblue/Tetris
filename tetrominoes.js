// 0 = spawn location. other rotations are relative to spawn location.

export const tetrominoes = [I_shape, J_shape, L_shape, O_shape, S_shape, T_shape, Z_shape]

export let I_shape = 
{
    current_rotation: 0,
    color: "cyan",
    0: [{x:4,y:1},{x:5,y:1},{x:6,y:1},{x:7,y:1}],
    1: [{x:5,y:0},{x:5,y:1},{x:5,y:2},{x:5,y:3}]
}

export let J_shape = 
{
    current_rotation: 0,
    color: "blue",
    0: [{x:4,y:1},{x:4,y:2},{x:5,y:2},{x:6,y:2}],
    1: [{x:5,y:1},{x:6,y:1},{x:5,y:2},{x:5,y:3}],
    2: [{x:4,y:2},{x:5,y:2},{x:6,y:2},{x:6,y:3}],
    3: [{x:5,y:1},{x:5,y:2},{x:5,y:3},{x:4,y:3}]
}

export let L_shape =
{
    current_rotation: 0,
    color: "orange",
    0: [{x:6,y:1},{x:6,y:2},{x:5,y:2},{x:4,y:2}],
    1: [{x:5,y:1},{x:5,y:2},{x:5,y:3},{x:6,y:3}],
    2: [{x:4,y:3},{x:4,y:2},{x:5,y:2},{x:6,y:2}],
    3: [{x:4,y:1},{x:5,y:1},{x:5,y:2},{x:5,y:3}]
}

export let O_shape =
{
    current_rotation: 0,
    color: "yellow",
    0: [{x:5,y:1},{x:6,y:1},{x:5,y:2},{x:6,y:2}]
}

export let S_shape = 
{
    current_rotation: 0,
    color: "green",
    0: [{x:5,y:1},{x:6,y:1},{x:4,y:2},{x:5,y:2}],
    1: [{x:4,y:1},{x:4,y:2},{x:5,y:2},{x:5,y:3}]
}

export let T_shape = 
{
    current_rotation: 0,
    color: "purple",
    0: [{x:5,y:1},{x:4,y:2},{x:5,y:2},{x:6,y:2}],
    1: [{x:5,y:1},{x:5,y:2},{x:5,y:3},{x:6,y:2}],
    2: [{x:4,y:2},{x:5,y:2},{x:6,y:2},{x:5,y:3}],
    3: [{x:5,y:1},{x:5,y:2},{x:5,y:3},{x:4,y:2}]
}

export let Z_shape =
{
    current_rotation: 0,
    color: "red",
    0: [{x:4,y:1},{x:5,y:1},{x:5,y:2},{x:6,y:2}],
    1: [{x:5,y:1},{x:5,y:2},{x:4,y:2},{x:4,y:3}]
}