import { MESSAGES } from '../consts/Messages';
import { MapUtils } from '../game/utils/MapUtils';

export class Dialog {	

	private origin: any;
	private dialogDispose: Function;

	congratulations() {
		if (this.workspace) {
			var linesText: any = document.getElementById('dialogLinesText');
			linesText.textContent = '';
			// Line produces warning when compiling Puzzle since there is no JavaScript
    		// generator.  But this function is never called in Puzzle, so no matter.

    		var code: string = this.workspace.getCode();
    		code = MapUtils.stripCode(code);

    		var noComments: string = code.replace(/\/\/[^\n]*/g, '');  // Inline comments.
    		noComments = noComments.replace(/\/\*.*\*\//g, '');  /* Block comments. */
		    noComments = noComments.replace(/[ \t]+\n/g, '\n');  // Trailing spaces.
		    noComments = noComments.replace(/\n+/g, '\n');  // Blank lines.
		    noComments = noComments.trim();

		    var lineCount: number = noComments.split('\n').length;
		    var pre:any = document.getElementById('containerCode');
		    pre.textContent = code;

		    var text: string;

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

			var border: any = document.getElementById('dialogBorder');
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