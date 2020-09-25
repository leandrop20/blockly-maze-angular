import * as Blockly from 'blockly';
import { StatusType } from '../enums/StatusType';

export class Help {

	private static instance: Help;

	static init(workspace: any, currentLevelID: number) {
		Help.instance = new Help();
		Help.instance.workspace = workspace;
		Help.instance.isOpened = false;
		Help.instance.currentLevelID = currentLevelID;
	}

	/**
	*	When the workspace changes, update the help as needed.
	*	@param {Blockly.Events.Abstract=} optEvent Custom data for event.
	*/
	static showIfHas(status: StatusType, optEvent: any = null) {
		// Help.instance.show(status, optEvent);
	}

	static hide(animation: boolean) { Help.instance.hide(animation); }

	private workspace: any;
	private origin: any;
	private dialogDispose: Function;
	private currentLevelID: number;
	private isOpened: boolean;

	show(status: StatusType, optEvent: any = null) {
		if (optEvent && optEvent.type == Blockly.Events.UI) {
			// Just a change to highlighting or somesuch.
			return;
		} else if (this.workspace.workspace.isDragging()) {
			// Don't change helps during drags.
			return;
		}

		var header: any = document.getElementById('dialog').children[0];
		header.style.display = 'none';

		var userBlocks: string = Blockly.Xml.domToText(
			Blockly.Xml.workspaceToDom(this.workspace.workspace));
		var toolbar: any[] = this.workspace.workspace.flyout_.workspace_.getTopBlocks(true);
		
		var content: any = null;
		var origin: any = null;
		var style: any = null;

		switch (this.currentLevelID) {
			case 1:
				if (this.workspace.workspace.getAllBlocks().length < 2) {
					content = document.getElementById('dialogHelpStack');
					style = { width: '370px', top: '130px', left: '215px' };
					origin = toolbar[0].getSvgRoot();

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

						content = document.getElementById('dialogHelpOneTopBlock');
						style = { width: '360px', top: '120px', left: '225px' };
						origin = topBlocks[0].getSvgRoot();
					} else if (status === StatusType.UNSET) {
						// Show run help dialog.
						content = document.getElementById('dialogHelpRun');
						style = { width: '360px', top: '410px', left: '400px' };
						origin = document.getElementById('runButton');
					}
				}
				break;
			case 2:
				if (status !== StatusType.UNSET &&
						document.getElementById('runButton').style.display == 'none') {
					content = document.getElementById('dialogHelpReset');
					style = { width: '360px', top: '410px', left: '400px' };
					origin = document.getElementById('resetButton');
				}
				break;
			case 3:
				if (userBlocks.indexOf('ucode_forever') == -1) {
					if (this.workspace.workspace.remainingCapacity() == 0) {
						content = document.getElementById('dialogHelpCapacity');
						style = { width: '430px', top: '310px', left: '50px' };
						origin = document.getElementById('capacityBubble');
					} else {
						content = document.getElementById('dialogHelpRepeat');
						style = { width: '360px', top: '360px', left: '425px' };
						origin = toolbar[3].getSvgRoot();
					}
				}
				break;
			case 4:
				if (this.workspace.workspace.remainingCapacity() == 0
						&& (userBlocks.indexOf('ucode_forever') == -1
							|| this.workspace.workspace.getTopBlocks(false).length > 1)) {
					content = document.getElementById('dialogHelpCapacity');
					style = { width: '430px', top: '310', left: '50px' };
					origin = document.getElementById('capacityBubble');
				} else {
					var showHelp: boolean = true;
					// Only show help if there is not a loop with two nested blocks.
					var blocks: any[] = this.workspace.workspace.getAllBlocks();
					
					for (let block of blocks) {
						if (block.type != 'ucode_forever') { continue; }

						var j = 0;

						while (block) {
							var kids = block.getChildren();
							block = kids.length ? kids[0] : null;
							j++
						}

						if (j > 2) {
							showHelp = false;
							break;
						}
					}

					if (showHelp) {
						content = document.getElementById('dialogHelpRepeatMany');
						style = { width: '360px', top: '360px', left: '425px' };
						origin = toolbar[3].getSvgRoot();
					}
				}
				break;
			case 6:
				if (userBlocks.indexOf('ucode_if') == -1) {
					content = document.getElementById('dialogHelpIf');
					style = { width: '360px', top: '430px', left: '425px' };
					origin = toolbar[4].getSvgRoot();
				}
				break;
			case 7: 
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

				// The hint says to change from 'ahead', but keep the hint visible
    			// until the user chooses 'right'.
				if (userBlocks.indexOf('isPathRight') == -1) {
					content = document.getElementById('dialogHelpMenu');
					style = { width: '360px', top: '430px', left: '425px' };
					origin = toolbar[4].getSvgRoot();
				}
				break;
			case 9:
				if (userBlocks.indexOf('ucode_ifElse') == -1) {
					content = document.getElementById('dialogHelpIfElse');
					style = { width: '360px', top: '305px', left: '425px' };
					origin = toolbar[5].getSvgRoot();
				}
				break;
		}
		
		if (content) {
			if (content.parentNode != document.getElementById('dialog')) {
				this.render(content, origin, true, false, style, null);
			}
		} else {
			this.hide(false);
		}
	}

	render(content: any, origin: any, animate: boolean, modal: boolean, style: any,
			disposeFunc: Function) {
		if (!content) { throw TypeError('Content not found: ' + content); }

		if (this.isOpened) { this.hide(false); }

		/*if (Blockly.getMainWorkspace()) {
			// Some levels have an editor instead of Blockly.
			Blockly.hideChaff(true);
		}*/

		this.isOpened = true;
		this.origin = origin;
		this.dialogDispose = disposeFunc;

		var dialog: any = document.getElementById('dialog');
		var shadow: any = document.getElementById('dialogShadow');
		var border: any = document.getElementById('dialogBorder');

		// Copy all the specified styles to the dialog.
		for (let name in style) { dialog.style[name] = style[name]; }

		if (modal) {
			shadow.style.visibility = 'visible';
			shadow.style.opacity = 0.3;
			shadow.style.zIndex = 9;
		}

		dialog.appendChild(content);
		content.className = content.className.replace('dialogHiddenContent', '');

		function endResult(_this) {
			// Check that the dialog wasn't closed during opening.
			if (_this.isOpened) {
				dialog.style.visibility = 'visible';
				dialog.style.zIndex = 10;
				border.style.visibility = 'hidden';
			}
		}

		if (animate && origin) {
			// BlocklyDialogs.matchBorder_(origin, false, 0.2);
    		// BlocklyDialogs.matchBorder_(dialog, true, 0.8);
    		// In 175ms show the dialog and hide the animated border.
    		setTimeout(() => { endResult(this); }, 175);
		} else {
			endResult(this);
		}
	}

	hide(animate: boolean) {
		if (!this.isOpened) { return; }

		// BlocklyDialogs.dialogUnbindDragEvents_();

		/*if (BlocklyDialogs.dialogMouseDownWrapper_) {
			Blockly.unbindEvent_(BlocklyDialogs.dialogMouseDownWrapper_);
			BlocklyDialogs.dialogMouseDownWrapper_ = null;
		}*/

		this.isOpened = false;

		this.dialogDispose && this.dialogDispose();
		this.dialogDispose = null;

		var origin: any = (animate === false) ? null : this.origin;
		var dialog: any = document.createElement('dialog');
		var shadow: any = document.createElement('dialogShadow');

		shadow.style.opacity = 0;

		function endResult() {
			shadow.style.zIndex = -1;
			shadow.style.visibility = 'hidden';

			var border = document.getElementById('dialogBorder');
			border.style.visibility = 'hidden';
		}

		if (origin && dialog) {
			// BlocklyDialogs.matchBorder_(dialog, false, 0.8);
		    // BlocklyDialogs.matchBorder_(origin, true, 0.2);
		    // In 175ms hide both the shadow and the animated border.
		    setTimeout(endResult, 175);
		} else {
			endResult();
		}

		dialog.style.visibility = 'hidden';
		dialog.style.zIndex = -1;

		var header = document.getElementById('dialogHeader');

		if (header) { header.parentNode.removeChild(header); }

		while (dialog.firstChild) {
			var content = dialog.firstChild;
			content.className += 'dialogHiddenContent';
			document.body.appendChild(content);
		}
	}

}