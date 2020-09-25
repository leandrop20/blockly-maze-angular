import * as Blockly from 'blockly';
import { Coord } from '../entities/Coord';
import { Point } from '../entities/Point';
import { MapUtils } from './utils/MapUtils';
import { CrashType } from '../enums/CrashType';
import { DirectionType } from '../enums/DirectionType';
import { SoundManager } from '../game/SoundManager';
import { SoundType } from '../enums/SoundType';

export class Player {

	public static WIDTH:number = 49;
	public static HEIGHT:number = 52;

	private crashType: CrashType;
	private svg: any;
	private SQUARE_SIZE: number;
	/**
	*	PIDs of animation tasks currently executing.
	*/
	private pidList: number[];
	public coord: Coord;
	public stepSpeed: number;
	public pInit: Point;
	public pEnd: Point;

	constructor(sprite: string, crashType:CrashType, svg: any, squareSize: number) {
		this.crashType = crashType;
		this.svg = svg;
		this.SQUARE_SIZE = squareSize;
		this.pidList = [];
		this.coord = new Coord();

		var clip: any = Blockly.utils.dom.createSvgElement('clipPath', { 
			id: 'playerClipPath'
		}, this.svg);

		Blockly.utils.dom.createSvgElement('rect', {
			id: 'clipRect',
			width: Player.WIDTH,
			height: Player.HEIGHT
		}, clip);

		var icon: any = Blockly.utils.dom.createSvgElement('image', {
			id: 'player',
			width: Player.WIDTH * 21,//49 * 21 = 1029
			height: Player.HEIGHT,
			'clip-path': 'url(#playerClipPath)'
		}, this.svg);

		icon.setAttributeNS(Blockly.utils.dom.XLINK_NS, 'xlink:href', sprite);
	}

	reset(direction: DirectionType, first: boolean) {
		// Kill all tasks.
		for (let i = 0; i < this.pidList.length; i++) {
			clearTimeout(this.pidList[i]);
		}

		this.pidList = [];

		this.coord.x = this.pInit.x;
		this.coord.y = this.pInit.y;

		if (first) {
			this.coord.d = Number(direction) + 1;
			this.scheduleFinish(false);

			this.pidList.push(setTimeout(() => {
				this.stepSpeed = 100;
				this.schedule(
					new Coord(this.coord.x, this.coord.y, this.coord.d * 4),
					new Coord(this.coord.x, this.coord.y, this.coord.d * 4 - 4),
				);
			this.coord.d++;
			}, this.stepSpeed * 5));
		} else {
			this.coord.d = Number(direction);
			var coord: Coord = new Coord(this.coord.x, this.coord.y, this.coord.d * 4);
			this.setPosition(coord);
		}
	}

	setPosition(coord: Coord, optAngle: number = null) {
		var player: any = this.svg.children.player;
		var clipRect: any = this.svg.children.playerClipPath.children.clipRect;

		player.setAttribute('x', coord.x * this.SQUARE_SIZE - coord.d * Player.WIDTH + 1);
		player.setAttribute('y', this.SQUARE_SIZE * (coord.y + 0.5) - Player.HEIGHT / 2 - 8);

		if (optAngle) {
			player.setAttribute('transform', 'rotate('
				+ optAngle + ', '
				+ (coord.x * this.SQUARE_SIZE + this.SQUARE_SIZE * 0.5) + ', '
				+ (coord.y * this.SQUARE_SIZE + this.SQUARE_SIZE * 0.5)
			+ ')');
		} else {
			player.setAttribute('transform', 'rotate(0, 0, 0)');
		}

		clipRect.setAttribute('x', coord.x * this.SQUARE_SIZE + 1);
		clipRect.setAttribute('y', player.getAttribute('y'));
	}

	pidListAdd(timeOutID: number) {
		this.pidList.push(timeOutID);
	}

	schedule(pInit: Coord, pEnd: Coord) {
		const DELTAS: Coord = new Coord(
			(pEnd.x - pInit.x) / 4,
			(pEnd.y - pInit.y) / 4,
			(pEnd.d - pInit.d) / 4
		);

		this.setPosition(new Coord(
			pInit.x + DELTAS.x,
			pInit.y + DELTAS.y,
			MapUtils.constrainDirection16(pInit.d + DELTAS.d)
		));

		this.pidList.push(setTimeout(() => {
			this.setPosition(new Coord(
				pInit.x + DELTAS.x * 2,
				pInit.y + DELTAS.y * 2,
				MapUtils.constrainDirection16(pInit.d + DELTAS.d * 2)
			));
		}, this.stepSpeed));

		this.pidList.push(setTimeout(() => {
			this.setPosition(new Coord(
				pInit.x + DELTAS.x * 3,
				pInit.y + DELTAS.y * 3,
				MapUtils.constrainDirection16(pInit.d + DELTAS.d * 3)
			));
		}, this.stepSpeed * 2));

		this.pidList.push(setTimeout(() => {
			this.setPosition(new Coord(
				pEnd.x,
				pEnd.y,
				MapUtils.constrainDirection16(pEnd.d)
			));
		}, this.stepSpeed * 3));
	}

	scheduleFinish(withSound: boolean) {
		var direction16: number = MapUtils.constrainDirection16(this.coord.d * 4);
		var coord: Coord = new Coord(this.coord.x, this.coord.y, 16);

		this.setPosition(coord);

		if (withSound) { SoundManager.play(SoundType.WIN); }

		this.stepSpeed = 150;// Slow down victory animation a bit.

		this.pidList.push(setTimeout(() => {
			coord.d = 18;
			this.setPosition(coord);
		}, this.stepSpeed));

		this.pidList.push(setTimeout(() => {
			coord.d = 16;
			this.setPosition(coord);
		}, this.stepSpeed * 2));

		this.pidList.push(setTimeout(() => {
			coord.d = direction16;
			this.setPosition(coord);
		}, this.stepSpeed * 3));
	}

	scheduleFail(forward: boolean) {
		var deltaX: number = 0;
		var deltaY: number = 0;

		var direction: DirectionType = (String(this.coord.d) as DirectionType);
		
		switch (direction) {
			case DirectionType.NORTH: deltaY = -1; break;
			case DirectionType.EAST: deltaX = 1; break;
			case DirectionType.SOUTH: deltaY = 1; break;
			case DirectionType.WEST: deltaX = -1; break;
		}

		if (!forward) {
			deltaX = -deltaX;
			deltaY = -deltaY;
		}

		if (this.crashType == CrashType.STOP) {
			deltaX /= 4;
			deltaY /= 4;

			var direction16: number = MapUtils.constrainDirection16(this.coord.d * 4);
			var coord = new Coord(
				this.coord.x + deltaX,
				this.coord.y + deltaY,
				direction16
			);

			this.setPosition(coord);

			SoundManager.play(SoundType.FAIL);

			this.pidList.push(setTimeout(() => {
				this.setPosition(new Coord(
					this.coord.x,
					this.coord.y,
					direction16
				));
			}, this.stepSpeed));

			this.pidList.push(setTimeout(() => {
				this.setPosition(new Coord(
					this.coord.x + deltaX,
					this.coord.y + deltaY,
					direction16
				));
				
				SoundManager.play(SoundType.FAIL);
			}, this.stepSpeed * 2));

			this.pidList.push(setTimeout(() => {
				this.setPosition(new Coord(
					this.coord.x,
					this.coord.y,
					direction16
				));
			}, this.stepSpeed * 3));
		} else {
			// Add a small random delta away from the grid.
			var deltaZ: number = (Math.random() - 0.5) * 10;
			var deltaD: number = (Math.random() - 0.5) / 2;

			deltaX += (Math.random() - 0.5) / 4;
			deltaY += (Math.random() - 0.5) / 4;

			deltaX /= 8;
			deltaY /= 8;

			var acceleration: number = 0;

			if (this.crashType == CrashType.FALL) {
				acceleration = 0.01;
			}

			this.pidList.push(setTimeout(() => {
				SoundManager.play(SoundType.FAIL);
			}, this.stepSpeed * 2));

			var setPosition: Function = (n) => {
				return () => {
					let direction16: number = 
						MapUtils.constrainDirection16(this.coord.d * 4 + deltaD * n);

					this.setPosition(new Coord(
						this.coord.x + deltaX * n,
						this.coord.y + deltaY * n,
						direction16
					), deltaZ * n);

					deltaY += acceleration;
				}
			}

			// 100 frames should get Pegman offscreen.
			for (let i = 1; i < 100; i++) {
				this.pidList.push(setTimeout(setPosition(i), this.stepSpeed * i / 2));
			}
		}
	}

	scheduleLookStep(path: any, delay: number) {
		this.pidList.push(setTimeout(() => {
			path.style.display = 'inline';
			setTimeout(() => {
				path.style.display = 'none';
			}, this.stepSpeed * 2);
		}, delay));
	}

	notDone(): boolean {
		return this.coord.x != this.pEnd.x || this.coord.y != this.pEnd.y;
	}

}