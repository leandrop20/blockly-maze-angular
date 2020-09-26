import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Interpreter } from 'src/assets/plugins/acorn_interpreter';

import { Map } from '../../game/Map';
import { Player } from '../../game/Player';
import { Workspace } from '../../game/Workspace';
import { Run } from '../../game/Run';
import { Log } from '../../interfaces/Log';
import { Skin } from '../../interfaces/Skin';
import { Level } from '../../interfaces/Level';
import { StatusType } from '../../enums/StatusType';
import { DirectionType } from '../../enums/DirectionType';
import { InterpreterType } from '../../enums/InterpreterType';
import { CommandType } from '../../enums/CommandType';
import { Coord } from '../../entities/Coord';
import { MapUtils } from '../../game/utils/MapUtils';
import { SoundManager } from '../../game/SoundManager';
import { Popup } from '../../game/Popup';
import { Help } from '../../game/Help';
import { opacity } from '../../animations/opacity';
import { SKINS } from '../../mock/data/skins.data';
import { LEVELS } from '../../mock/data/levels.data';

@Component({
	selector: 'app-game',
	templateUrl: './game.component.html',
	styleUrls: ['./game.component.css'],
	animations: [opacity]
})

export class GameComponent implements AfterViewInit {

	static instance: GameComponent;

	@ViewChild('stage') stageMap: ElementRef;
	@ViewChild('blocklyStage') blocklyStage: ElementRef;
	@ViewChild('runButton') runBt: ElementRef;
	@ViewChild('resetButton') resetBt: ElementRef;
	@ViewChild('popup') popup: ElementRef;

	private map: Map;
	private workspace: Workspace;
	private startDirection: DirectionType;
	private status: StatusType;
	private running: boolean;
	private log: Log[];
	private skin: Skin;
	public level: Level;
	public overlayState: string;

	constructor() {
		GameComponent.instance = this;
		this.overlayState = 'hide';
	}

	ngAfterViewInit() {
		this.startDirection = DirectionType.EAST;
		this.status = StatusType.UNSET;
		this.running = false;

		this.skin = SKINS[0];

		/*	LEVEL TEST TEMP	*/
		this.level = LEVELS[0];

		this.map = new Map(JSON.parse(this.level.map), this.skin, this.stageMap);
		this.map.init(this.startDirection);

		this.workspace = new Workspace(this.level, this.skin.marker, this.updateCapacity);

		Popup.init(this.popup.nativeElement, this.workspace, this.changeOverlayState);
		Help.init(this.workspace, this.level.id);
		SoundManager.load(this.skin, this.workspace.workspace);

		// All other levels get interactive help.  But wait 5 seconds for the
    	// user to think a bit before they are told what to do.
    	setTimeout(() => {
    		Help.showIfHas(this.status);
    	}, 5000);
	}

	onRun() {
		if (!this.running) {
			this.running = true;

			Help.hide(false);

			// Only allow a single top block on level 1.
			if (this.level.id == 1 && this.workspace.workspace.getTopBlocks(false).length > 1
					&& this.status != StatusType.SUCCESS) {
				Help.showIfHas(this.status);
				return;
			}

			this.runBt.nativeElement.style.display = 'none';
			this.resetBt.nativeElement.style.display = 'inline';

			this.map.reset(this.startDirection, false);
			this.execute();
		}
	}

	onReset() {
		if (this.running) {
			this.resetBt.nativeElement.style.display = 'none';
			this.runBt.nativeElement.style.display = 'inline';

			this.workspace.resetHighlightBlock();
			this.map.reset(this.startDirection, false);

			Help.showIfHas(this.status);

			this.running = false;
		}
	}

	execute() {
		this.log = [];
  		// Blockly.selected && Blockly.selected.unselect();

		var code: string = this.workspace.getCode();
		this.status = StatusType.UNSET;

		var interpreter: Interpreter = new Interpreter(code, (i, s) => {
			Run.exec(i, s, this.workspace.workspace, this.checkMove);
		});

		try {
			var ticks: number = 10000;

			while (interpreter.step()) {
				if (ticks-- == 0) {
					throw Infinity;
				}
			}

			this.status = this.map.player.notDone() ? StatusType.FAILURE : StatusType.SUCCESS;
		} catch (e) {
			switch (e) {
				case Infinity: this.status = StatusType.TIMEOUT; break;
				case false: this.status = StatusType.ERROR; break;
				default: this.status = StatusType.ERROR; alert(e);
			}
		}

		// Fast animation if execution is successful. Slow otherwise.
		if (this.status === StatusType.SUCCESS) {
			this.map.player.stepSpeed = 100;
			this.log.push({ 
				command: CommandType.FINISH,
				id: null,
			});
		} else {
			this.map.player.stepSpeed = 150;
		}

		// this.log now contains a transcript of all the user's actions.
  		// Reset the maze and animate the transcript.
		this.map.reset(this.startDirection, false);
		this.map.player.pidListAdd(setTimeout(() => { this.animate(); }, 100));
	}

	checkMove(interpreterType: InterpreterType, direction: DirectionType, id: number) {
		switch (interpreterType) {
			case InterpreterType.MOVE: return GameComponent.instance.move(direction, id);
			case InterpreterType.TURN: return GameComponent.instance.turn(direction, id);
			case InterpreterType.IS_PATH: return GameComponent.instance.isPath(direction, id);
			case InterpreterType.NOT_DONE: return GameComponent.instance.map.player.notDone();
		}

		return null;
	}

	move(direction: DirectionType, id: number) {
		if (!this.isPath(direction, null)) {
			let command = (direction == DirectionType.SOUTH)	
				? CommandType.FAIL_BACKWARD : CommandType.FAIL_FORWARD;
			
			this.log.push({ command: command, id: id });
			throw false;
		}

		// If moving backward, flip the effective direction.
		var effectiveDirection: number = this.map.player.coord.d + Number(direction);
		direction = (String(MapUtils.constrainDirection4(effectiveDirection)) as DirectionType);
		var command: CommandType;

		switch (direction) {
			case DirectionType.NORTH:
				this.map.player.coord.y--;
				command = CommandType.NORTH;
				break;
			case DirectionType.EAST:
				this.map.player.coord.x++;
				command = CommandType.EAST;
				break;
			case DirectionType.SOUTH:
				this.map.player.coord.y++;
				command = CommandType.SOUTH;
				break;
			case DirectionType.WEST:
				this.map.player.coord.x--;
				command = CommandType.WEST;
				break;
		}
		
		this.log.push({ command: command, id: id });
	}

	turn(direction: DirectionType, id: number) {
		switch (direction) {
			case DirectionType.EAST:
				this.map.player.coord.d++;
				this.log.push({ command: CommandType.TURN_RIGHT, id: id });
				break;
			case DirectionType.WEST:
				this.map.player.coord.d--;
				this.log.push({ command: CommandType.TURN_LEFT, id: id });
				break;
		}

		this.map.player.coord.d = MapUtils.constrainDirection4(this.map.player.coord.d);
	}

	isPath(direction: DirectionType, id: number): boolean {
		var result: any = this.map.isPath(direction, id);

		if (id) { this.log.push(result.log); }

		return result.isPath;
	}

	animate() {
		var player: Player = this.map.player;
		var command: Log = this.log.shift();
		
		if (command) {
			if (!command.command) {
				this.workspace.resetHighlightBlock();
	    		Help.showIfHas(this.status);
				return;
			}

			this.workspace.setHighlightBlock(String(command.id));

			var coord1: Coord = new Coord(player.coord.x, player.coord.y, player.coord.d * 4);
			var coord2: Coord = new Coord(player.coord.x, player.coord.y, player.coord.d * 4);

			switch (command.command) {
				case CommandType.NORTH:
					coord2.y -= 1;
					player.schedule(coord1, coord2);
					player.coord.y--;
					break;
				case CommandType.EAST:
					coord2.x += 1;
					player.schedule(coord1, coord2);
					player.coord.x++;
					break;
				case CommandType.SOUTH:
					coord2.y += 1;
					player.schedule(coord1, coord2);
					player.coord.y++;
					break;
				case CommandType.WEST:
					coord2.x -= 1;
					player.schedule(coord1, coord2);
					player.coord.x--;
					break;
				case CommandType.LOOK_NORTH: this.map.scheduleLook(DirectionType.NORTH); break;
				case CommandType.LOOK_EAST: this.map.scheduleLook(DirectionType.EAST); break;
				case CommandType.LOOK_SOUTH: this.map.scheduleLook(DirectionType.SOUTH); break;
				case CommandType.LOOK_WEST: this.map.scheduleLook(DirectionType.WEST); break;
				case CommandType.FAIL_FORWARD: player.scheduleFail(true); break;
				case CommandType.FAIL_BACKWARD: player.scheduleFail(false); break;
				case CommandType.TURN_LEFT:
					coord2.d -= 4;
					player.schedule(coord1, coord2);
					player.coord.d = MapUtils.constrainDirection4(player.coord.d - 1);
					break;
				case CommandType.TURN_RIGHT:
					coord2.d += 4;
					player.schedule(coord1, coord2);
					player.coord.d = MapUtils.constrainDirection4(player.coord.d + 1);
					break;
				case CommandType.FINISH:
					player.scheduleFinish(true);
      				setTimeout(() => {
      					Popup.show();
      				}, 1000);
					break;
			}
		}

		player.pidListAdd(setTimeout(() => { this.animate(); }, player.stepSpeed * 5));
	}

	updateCapacity() {
		var _this: GameComponent = GameComponent.instance;
		var remainingBlocks: number = _this.workspace.workspace.remainingCapacity();
		var cap: any = _this.stageMap.nativeElement.children.capacityBubble.children.capacity;

		cap.style.display = (remainingBlocks == Infinity) ? 'none' : 'inline';

		if (remainingBlocks != Infinity) {
			cap.innerHTML = '';
			var capSpan: any = document.createElement('span');
			capSpan.className = 'capacityNumber';
			capSpan.appendChild(document.createTextNode(String(remainingBlocks)));

			var msg: string = (remainingBlocks == 1) ? 'Resta %1 bloco.' : 'Restam %1 blocos.';
			var parts: string[] = msg.split(/%\d/);
			
			for (let i = 0; i < parts.length; i++) {
				cap.appendChild(document.createTextNode(parts[i]));

				if (i != parts.length - 1) {
					cap.appendChild(capSpan.cloneNode(true));
				}
			}
		}
	}

	changeOverlayState(bool: boolean) {
		GameComponent.instance.overlayState = (bool) ? 'show' : 'hide';
	}

}