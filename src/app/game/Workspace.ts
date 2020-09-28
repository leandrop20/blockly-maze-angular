import * as PtBr from 'blockly/msg/pt-br';
import * as Blockly from 'blockly';

import { Blocks } from './Blocks';
import { Level } from '../interfaces/Level';

export class Workspace {

	public workspace: any;

	constructor(level: Level, marker: string, updateCapacity: Function) {
		Blockly.setLocale(PtBr);

		Object(Blockly).JavaScript.addReservedWords(
			'moveForward,moveBackward,turnRight,turnLeft,isPathForward,'
			+ 'isPathRight,isPathBackward,isPathLeft');

		Blocks.create(marker);

		this.workspace = Blockly.inject('blocklyDiv', {
			readOnly: false,
			media: 'assets/blockly/',
			trashcan: true,
			horizontalLayout: false,
			maxBlocks: (level.blocks_amount) ? level.blocks_amount + 1 : null,
			move: {
				scroolbars: true,
				drag: true,
				wheel: true
			},
			toolbox: '<xml xmlns="https://developers.google.com/blockly/xml">'
				+ level.blocks + '</xml>'
		} as Blockly.BlocklyOptions);

		Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(`
			<xml xmlns="https://developers.google.com/blockly/xml">
				<block type="ucode_exec" movable="false" deletable="false"></block>
			</xml>
		`), this.workspace);

		// Make connecting blocks easier for beginners.
		if (level.id == 1) {
			Object(Blockly).SNAP_RADIUS *= 2;
    		Object(Blockly).CONNECTING_SNAP_RADIUS = Object(Blockly).SNAP_RADIUS;
		}

		this.workspace.addChangeListener(updateCapacity);
		window.addEventListener('resize', this.onResize);
		this.onResize(null);
	}

	getCode(): string {
		return Blockly['JavaScript'].workspaceToCode(this.workspace);
	}

	injectReadonly(id: string, xml: any) {
		var div: any = document.getElementById(id);

		if (!div.firstChild) {
			var workspace: any = Blockly.inject(div, { rtl: false, readOnly: true });

			if (typeof xml != 'string') { xml = xml.join(''); }

			Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xml), workspace);
		}
	}

	setHighlightBlock(id: string) {
		if (id) {
			var m: any = id.match(/^block_id_([^']+)$/);
			
			if (m) { id = m[1]; }
		}

		this.workspace.highlightBlock(id);
	}

	resetHighlightBlock() {
		this.workspace.highlightBlock(null);
	}

	onResize(e) {
		console.log('::implement workspace responsive::');
		// var visualization: any = document.getElementById('visualization');
		// var blocklyDiv: any = document.getElementById('blocklyDiv');

		// var top: number = visualization.offsetTop;
		// blocklyDiv.style.top = Math.max(10, top - window.pageYOffset) + 'px';
		// blocklyDiv.style.left = '420px';
		// blocklyDiv.style.width = (window.innerWidth - 440) + 'px';

		// if (this.workspace) {
		// 	this.workspace.scale = 1.0;
		// 	Object(Blockly).svgResize(this.workspace);
		// }
	}

}