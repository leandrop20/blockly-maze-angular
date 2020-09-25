// Map each possible shape to a sprite.
// Input: Binary string representing Centre/North/West/South/East squares.
// Output: [x, y] coordinates of each tile's sprite in tiles.png.
export const TileShapes: any = {
	'10010': [4, 0],  // Dead ends
	'10001': [3, 3],
	'11000': [0, 1],
	'10100': [0, 2],
	'11010': [4, 1],  // Vertical
	'10101': [3, 2],  // Horizontal
	'10110': [0, 0],  // Elbows
	'10011': [2, 0],
	'11001': [4, 2],
	'11100': [2, 3],
	'11110': [1, 1],  // Junctions
	'10111': [1, 0],
	'11011': [2, 1],
	'11101': [1, 2],
	'11111': [2, 2],  // Cross
	'null0': [4, 3],  // Empty
	'null1': [3, 0],
	'null2': [3, 1],
	'null3': [0, 3],
	'null4': [1, 3]
};