import { SquareType } from '../../enums/SquareType';

export class MapUtils {

	/**
	*	Return a value of '0' if the specified square is wall or out of bounds,
	*	'1' otherwise (empty, start, finish).
	*/
	static normalize(x: number, y: number, map: [][]): string {
		if (x < 0 || x >= map.length || y < 0 || y >= map[0].length) {
			return '0';
		}

		return (map[y][x] == SquareType.WALL) ? '0' : '1';
	}

	/**
	*	Keep the direction within 0-15, wrapping at both ends.
	*	@param {number} d Potentially out-of-bounds direction value.
	*	@return {number} Legal direction value.
	*/
	static constrainDirection16(d: number): number {
		d = Math.round(d) % 16;

		if (d < 0) { d += 16; }

		return d;
	}

	static constrainDirection4(d: number): number {
		d = Math.round(d) % 4;

		if (d < 0) { d += 4; }

		return d;
	}

	static stripCode(code: string): string {
		// Since IE doesn't include non-breaking-space (0xa0) in their \s character
		// class (as required by section 7.2 of the ECMAScript spec), we explicitly
		// include it in the regexp to enforce consistent cross-browser behavior.
		function trimRight(str: string): string { return str.replace(/[\s\xa0]+$/, ''); }

		return trimRight(code.replace(/(,\s*)?'block_id_[^']+'\)/g, ')'));
	}

}