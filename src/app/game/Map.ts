import { ElementRef } from '@angular/core';
import * as Blockly from 'blockly';
import { Skin } from '../interfaces/Skin';
import { SquareType } from '../enums/SquareType';
import { TileShapes } from '../consts/TileShapes';
import { Point } from '../entities/Point';
import { DirectionType } from '../enums/DirectionType';
import { CommandType } from '../enums/CommandType';
import { MapUtils } from './utils/MapUtils';
import { Player } from './Player';

export class Map {

	private static SQUARE_SIZE: number = 50;
	private static rows: number;
	private static cols: number;
	private static width: number;
	private static height: number;

	private svg: any;
	private map: [][];
	private skin: Skin;
	public player: Player;

	constructor(map: [][], skin:Skin, stage: ElementRef) {
		this.map = map;
		this.skin = skin;
		this.svg = stage.nativeElement.children.svgMap;
		Map.rows = map.length;
		Map.cols = map[0].length;
		Map.width = Map.SQUARE_SIZE * Map.cols;
		Map.height = Map.SQUARE_SIZE * Map.rows;

		let scale: number = Math.max(Map.rows, Map.cols) * Map.SQUARE_SIZE;
		this.svg.setAttribute('viewBox', '0 0 ' + scale + ' ' + scale);

		Blockly.utils.dom.createSvgElement('rect', {
			width: Map.width,
			height: Map.height,
			fill: '#F1EEE7',
			stroke: '#CCB',
			'stroke-width': 1
		}, this.svg);

		if (skin.background) {
			let tile = Blockly.utils.dom.createSvgElement('image', {
				width: Map.width,
				height: Map.height,
				x: 0,
				y: 0
			}, this.svg);

			tile.setAttributeNS(Blockly.utils.dom.XLINK_NS, 'xlink:href', skin.background);
		}

		this.createSquares();

		let finishMarker = Blockly.utils.dom.createSvgElement('image', {
			id: 'finish',
			width: 20,
			height: 34
		}, this.svg);

		finishMarker.setAttributeNS(Blockly.utils.dom.XLINK_NS, 'xlink:href', skin.marker);

		this.player = new Player(skin.sprite, skin.crashType, this.svg, Map.SQUARE_SIZE);
	}

	createSquares() {
		let tileID: number = 0;

		for (let y: number = 0; y < Map.rows; y++) {
			for (let x: number = 0; x < Map.cols; x++) {
				let tileShape: any = MapUtils.normalize(x, y, this.map) +
					MapUtils.normalize(x, y - 1, this.map) + //NORTH
					MapUtils.normalize(x + 1, y, this.map) + //EAST
					MapUtils.normalize(x, y + 1, this.map) + //SOUTH
					MapUtils.normalize(x - 1, y, this.map); //WEST

				if (!TileShapes[tileShape]) {
					if (tileShape == '00000' && Math.random() > 0.3) {
						tileShape = 'null0';
					} else {
						tileShape = 'null' + Math.floor(1 + Math.random() * 4);
					}
				}

				let left: number = TileShapes[tileShape][0];
				let top: number = TileShapes[tileShape][1];
				
				let tileClip = Blockly.utils.dom.createSvgElement('clipPath', {
					id: 'tileClipPath' + tileID
				}, this.svg);

				Blockly.utils.dom.createSvgElement('rect', {
					width: Map.SQUARE_SIZE,
					height: Map.SQUARE_SIZE,
					x: x * Map.SQUARE_SIZE,
					y: y * Map.SQUARE_SIZE
				}, tileClip);

				let tile = Blockly.utils.dom.createSvgElement('image', {
					'clip-path': 'url(#tileClipPath' + tileID + ')',
					width: Map.SQUARE_SIZE * 5,
					height: Map.SQUARE_SIZE * 4,
					x: (x - left) * Map.SQUARE_SIZE,
					y: (y - top) * Map.SQUARE_SIZE
				}, this.svg);

				tile.setAttributeNS(Blockly.utils.dom.XLINK_NS, 'xlink:href', this.skin.tiles);

				tileID++;
			}
		}
	}

	init(direction: DirectionType) {
		for (let y: number = 0; y < Map.rows; y++) {
			for (let x: number = 0; x < Map.cols; x++) {
				if (this.map[y][x] == SquareType.START) {
					this.player.pInit = new Point(x, y);
				} else if (this.map[y][x] == SquareType.FINISH) {
					this.player.pEnd = new Point(x, y);
				}
			}
		}

		this.reset(direction, true);
	}

	/**
	*	Reset the maze to the start position and kill any pending animation tasks.
	*	@param {boolean} first True if an opening animation is to be played.
	*/
	reset(direction: DirectionType, first: boolean) {
		this.player.reset(direction, first);

		let finishIcon: any = this.svg.children.finish;
		let fmWidth: number = finishIcon.getAttribute('width') * 0.5;
		let fmHeight: number = finishIcon.getAttribute('height');
		finishIcon.setAttribute('x', Map.SQUARE_SIZE * (this.player.pEnd.x + 0.5) - fmWidth);
		finishIcon.setAttribute('y', Map.SQUARE_SIZE * (this.player.pEnd.y + 0.6) - fmHeight);

		let lookIcon: any = this.svg.children.look;
		lookIcon.style.display = 'none';
		lookIcon.parentNode.appendChild(lookIcon);
		let paths: any[] = lookIcon.getElementsByTagName('path');

		for (let p of paths) {
			p.setAttribute('stroke', this.skin.look);
		}
	}

	/**
	*	Display the look icon at Player's current location, in the specified direction.
	*	@param {!Maze.DirectionType} d Direction (0 - 3).
	*/
	scheduleLook(direction: DirectionType) {
		let x: number = this.player.coord.x;
		let y: number = this.player.coord.y;

		switch(direction) {
			case DirectionType.NORTH: x += 0.5; break;
			case DirectionType.WEST:
				x += 1;
				y += 0.5;
				break;
			case DirectionType.SOUTH:
				x += 0.5;
				y += 1;
				break;
			case DirectionType.EAST: y += 0.5; break;
		}

		x *= Map.SQUARE_SIZE;
		y *= Map.SQUARE_SIZE;
		let deg: number = Number(direction) * 90 - 45;

		let lookIcon: any = this.svg.children.look;
		lookIcon.setAttribute('transform', 
			'translate(' + x + ', ' + y + ') '
			+ 'rotate(' + deg + ' 0 0) scale(.4)');

		let paths: any[] = lookIcon.getElementsByTagName('path');
		lookIcon.style.display = 'inline';
		
		for (let i:number = 0, path: any; (path = paths[i]); i++) {
			this.player.scheduleLookStep(path, this.player.stepSpeed * i);
		}
	}

	/**
	*	Is there a path next to pegman?
	*	@param {number} direction Direction to look
	*	    (0 = forward, 1 = right, 2 = backward, 3 = left).
	*	@param {?string} id ID of block that triggered this action.
	*	    Null if called as a helper function in Maze.move().
	*	@return {boolean} True if there is a path.
	*/
	isPath(direction: DirectionType, id: number): any {
		let effectiveDirection: number = this.player.coord.d + Number(direction);
		direction = (String(MapUtils.constrainDirection4(effectiveDirection)) as DirectionType);
		let square: number;
		let command: CommandType;

		switch (direction) {
			case DirectionType.NORTH:
				square = (this.map[this.player.coord.y - 1]
					&& this.map[this.player.coord.y - 1][this.player.coord.x]);
				command = CommandType.LOOK_NORTH;
				break;
			case DirectionType.EAST:
				square = this.map[this.player.coord.y][this.player.coord.x + 1];
				command = CommandType.LOOK_EAST;
				break;
			case DirectionType.SOUTH:
				square = (this.map[this.player.coord.y + 1]
					&& this.map[this.player.coord.y + 1][this.player.coord.x]);
				command = CommandType.LOOK_SOUTH;
				break;
			case DirectionType.WEST:
				square = this.map[this.player.coord.y][this.player.coord.x - 1];
				command = CommandType.LOOK_WEST;
				break;
		}

		let squareType: SquareType = (String(square) as SquareType);

		return {
			isPath: (squareType !== SquareType.WALL && squareType !== undefined),
			log: { command: command, id: id }
		};
	}

}