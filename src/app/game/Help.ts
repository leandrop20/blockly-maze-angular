import * as Blockly from 'blockly';
import { StatusType } from '../enums/StatusType';
import { HelpType } from '../enums/HelpType';
import { HelpStyle } from '../interfaces/HelpStyle';
import { HELP_TEXTS } from '../consts/HelpTexts';

export class Help {

	private static instance: Help;

	static init(help: any, workspace: any, currentLevelID: number, changeHelpState: Function) {
		Help.instance = new Help();
		Help.instance.help = help;
		Help.instance.workspace = workspace;
		Help.instance.isOpened = false;
		Help.instance.currentLevelID = currentLevelID;
		Help.instance.changeHelpState = changeHelpState;
	}

	static showIfHas(status: StatusType) {
		Help.instance.show(status);
	}

	static hide() {
		Help.instance.hide();
	}

	private help: any;
	private container: any;
	private workspace: any;
	private isOpened: boolean;
	private currentLevelID: number;
	private changeHelpState: Function;

	show(status: StatusType) {
		var workspaceXML: any = Blockly.Xml.workspaceToDom(this.workspace.workspace);
		var userBlocks: string = Blockly.Xml.domToText(workspaceXML);
		var toolbar: any[] = this.workspace.workspace.flyout_.workspace_.getTopBlocks(true);
		var type: HelpType = HelpType.NULL;
		var style: HelpStyle;

		this.container = this.help.children[0];
		
		this.container.style.top = 'unset';
		this.container.style.left = 'unset';
		this.container.style.transform = 'unset';

		switch (this.currentLevelID) {
			case 1:
				if (this.workspace.workspace.getAllBlocks().length < 2) {
					type = HelpType.STACK;
					style = { width: 370, top: 130, left: 215 };
				} else {
					var topBlocks: any[] = this.workspace.workspace.getTopBlocks(true);

					if (topBlocks.length > 1) {
						var xml: any[] = [`
							<xml>
								<block type="ucode_moveForward" x="10" y="10">
									<next>
										<block type="ucode_moveForward"></block>'
									</next>
								</block>
				            </xml>
						`];
						this.workspace.injectReadonly('sampleOneTopBlock', xml);

						type = HelpType.ONE_TOP_BLOCK;
						style = { width: 360, top: 120, left: 225 };
					} else if (status === StatusType.UNSET) {
						type = HelpType.RUN;
						style = { width: 360, top: 410, left: 400 };
					}
				}
				break;
			case 2:
				if (status != StatusType.UNSET
						&& document.getElementById('runButton').style.display == 'none') {
					type = HelpType.RESET;
					style = { width: 360, top: 410, left: 400 };
				}
				break;
			case 3:
				if (userBlocks.indexOf('ucode_forever') == -1) {
					if (this.workspace.workspace.remainingCapacity() == 0) {
						type = HelpType.CAPACITY;
						style = { width: 430, top: 310, left: 50 };
					} else {
						type = HelpType.REPEAT;
						style = { width: 360, top: 360, left: 425 };
					}
				}
				break;
			case 4:
				if (this.workspace.workspace.remainingCapacity() == 0
						&& (userBlocks.indexOf('ucode_forever') == -1
							|| this.workspace.workspace.getTopBlocks(false).length > 1)) {
					type = HelpType.CAPACITY;
					style = { width: 430, top: 310, left: 50 };
				} else {
					var showHelp: boolean = true;

					// Only show help if there is not a loop with two nested blocks.
					var blocks: any[] = this.workspace.workspace.getAllBlocks();

					for (let block of blocks) {
						if (block.type != 'ucode_forever') { continue; }

						var j: number = 0;

						while (block) {
							var kids: any = block.getChildren();
							block = kids.length ? kids[0] : null;
							j++;
						}

						if (j > 2) {
							showHelp = false;
							break;
						}
					}

					if (showHelp) {
						type = HelpType.REPEAT_MANY;
						style = { width: 360, top: 360, left: 425 };
					}
				}
				break;
			case 6:
				if (userBlocks.indexOf('ucode_if') == -1) {
					type = HelpType.IF;
					style = { width: 360, top: 430, left: 425 };
				}
				break;
			case 7:
				// The hint says to change from 'ahead', but keep the hint visible
    			// until the user chooses 'right'.
				if (userBlocks.indexOf('isPathRight') == -1) {
					type = HelpType.MENU;
					style = { width: 360, top: 430, left: 425 };
				}
				break;
			case 9:
				if (userBlocks.indexOf('ucode_ifElse') == -1) {
					type = HelpType.IF_ELSE;
					style = { width: 360, top: 305, left: 425 };
				}
				break;
		}

		if (type != HelpType.NULL) { this.render(type, style); }
	}

	render(type: HelpType, style: HelpStyle) {
		if (this.isOpened) { this.hide(); }

		this.isOpened = true;

		var body: any = this.container.children[0];
		var table: any = body.children[0];
		
		table.innerHTML = HELP_TEXTS[type];

		if (type === HelpType.MENU) {
			var span: any = document.createElement('span');
			span.className = 'helpMenuFake';
			var options: string[] = [' frente', 'esquerda ↺', 'direita ↻'];
			var prefix: number = Object(Blockly).utils.string.commonWordPrefix(options);
			var suffix: number = Object(Blockly).utils.string.commonWordSuffix(options);
			var option: string;

			if (suffix) {
				option = options[0].slice(prefix, -suffix);
			} else {
				option = options[0].substring(prefix);
			}

			// Add dropdown arrow: "option ▾" (LTR) or "▾ אופציה" (RTL)
			span.textContent = option + ' ' + Blockly.FieldDropdown.ARROW_CHAR;
			// Inject fake dropdown into message.
			var container: any = document.getElementById('helpMenuText');
			var msg: string = container.textContent;
			container.textContent = '';
			var parts: string[] = msg.split(/%\d/);

			for (let i = 0; i < parts.length; i++) {
				container.appendChild(document.createTextNode(parts[i]));

				if (i != parts.length - 1) {
					container.appendChild(span.cloneNode(true));
				}
			}
		}

		for (let name in style) { this.container.style[name] = style[name] + 'px'; }

		this.help.style.display = 'block';
		this.changeHelpState(true);
	}

	hide() {
		if (!this.isOpened) { return; }

		this.isOpened = false;

		this.changeHelpState(false);
		setTimeout(() => {
			this.help.style.display = 'none';
		}, 200);
	}

}