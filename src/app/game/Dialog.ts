import { DialogType } from '../enums/DialogType';
import { MESSAGES } from '../consts/Messages';
import { MapUtils } from '../game/utils/MapUtils';

export class Dialog {

	private static instance: Dialog;

	static init(workspace: any) {
		Dialog.instance = new Dialog();
		Dialog.instance.workspace = workspace;
		Dialog.instance.isOpened = false;
	}

	static show(type: DialogType) {
		switch (type) {
			case DialogType.CONGRATULATIONS: Dialog.instance.congratulations(); break;
		}
	}

	static hide(animation: boolean) { Dialog.instance.hide(animation); }

	private workspace: any;
	private origin: any;
	private dialogDispose: Function;
	private isOpened: boolean;

	congratulations() {
		let content: any = document.getElementById('dialogDone');
		let style: any = { width: '40%', left: '30%', top: '3em' };

		let header: any = document.getElementById('dialog').children[0];
		header.style.display = 'block';

		if (this.workspace) {
			let linesText: any = document.getElementById('dialogLinesText');
			linesText.textContent = '';
			// Line produces warning when compiling Puzzle since there is no JavaScript
    		// generator.  But this function is never called in Puzzle, so no matter.

    		let code: string = this.workspace.getCode();
    		code = MapUtils.stripCode(code);

    		let noComments: string = code.replace(/\/\/[^\n]*/g, '');  // Inline comments.
    		noComments = noComments.replace(/\/\*.*\*\//g, '');  /* Block comments. */
		    noComments = noComments.replace(/[ \t]+\n/g, '\n');  // Trailing spaces.
		    noComments = noComments.replace(/\n+/g, '\n');  // Blank lines.
		    noComments = noComments.trim();

		    let lineCount: number = noComments.split('\n').length;
		    let pre:any = document.getElementById('containerCode');
		    pre.textContent = code;

		    let text: string;

		    if (lineCount == 1) {
		    	text = MESSAGES.linesOfCode1;
		    } else {
		    	text = MESSAGES.linesOfCode2.replace('%1', String(lineCount));
		    }

		    linesText.appendChild(document.createTextNode(text));
		}

		let text2: string;

		if (true) {//CHECK IF LAST LEVEL
			text2 = MESSAGES.nextLevel.replace('%1', String(1));//SET NEXT LEVEL HERE
		} else {
			text2 = MESSAGES.finalLevel;
		}

		this.render(content, null, false, true, style, () => {
			console.log('CALLBACK DIALOG');
		});

		document.getElementById('dialogDoneText').textContent = text2;
	}

	/**
	*	Show the dialog pop-up.
	*	@param {Element} content DOM element to display in the dialog.
	*	@param {Element} origin Animate the dialog opening/closing from/to this
	*		DOM element.  If null, don't show any animations for opening or closing.
	*	@param {boolean} animate Animate the dialog opening (if origin not null).
	*	@param {boolean} modal If true, grey out background and prevent interaction.
	*	@param {!Object} style A dictionary of style rules for the dialog.
	*	@param {Function} disposeFunc An optional function to call when the dialog
	*		closes.  Normally used for unhooking events.
	*/
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

		let dialog: any = document.getElementById('dialog');
		let shadow: any = document.getElementById('dialogShadow');
		let border: any = document.getElementById('dialogBorder');

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

		let origin: any = (animate === false) ? null : this.origin;
		let dialog: any = document.createElement('dialog');
		let shadow: any = document.createElement('dialogShadow');

		shadow.style.opacity = 0;

		function endResult() {
			shadow.style.zIndex = -1;
			shadow.style.visibility = 'hidden';

			let border = document.getElementById('dialogBorder');
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

		let header = document.getElementById('dialogHeader');

		if (header) { header.parentNode.removeChild(header); }

		while (dialog.firstChild) {
			let content = dialog.firstChild;
			content.className += 'dialogHiddenContent';
			document.body.appendChild(content);
		}
	}

}