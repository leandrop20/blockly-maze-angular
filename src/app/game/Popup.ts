import { MESSAGES } from '../consts/Messages';
import { MapUtils } from '../game/utils/MapUtils';

export class Popup {

	private static instance: Popup;

	static init(popup: any, workspace: any, changeOverlayState: Function) {
		Popup.instance = new Popup();
		Popup.instance.popup = popup;
		Popup.instance.workspace = workspace;
		Popup.instance.isOpened = false;
		Popup.instance.changeOverlayState = changeOverlayState;
	}

	static show() {
		Popup.instance.show();
	}

	private popup: any;
	private workspace: any;
	private isOpened: boolean;
	private changeOverlayState: Function;

	show() {
		this.isOpened = true;

		var container: any = this.popup.children[1];
		var body: any = container.children[1];
		var title: any = body.children[0];
		var lines: any = body.children[1];
		var pre: any = body.children[2];
		var done: any = body.children[3];

		title.textContent = MESSAGES.congratulations;

		var code: string = this.workspace.getCode();
		code = MapUtils.stripCode(code);

		var noComments: string = code.replace(/\/\/[^\n]*/g, '');  // Inline comments.
		noComments = noComments.replace(/\/\*.*\*\//g, '');  /* Block comments. */
	    noComments = noComments.replace(/[ \t]+\n/g, '\n');  // Trailing spaces.
	    noComments = noComments.replace(/\n+/g, '\n');  // Blank lines.
	    noComments = noComments.trim();

	    var lineCount: number = noComments.split('\n').length;

	    var text: string;

	    if (lineCount == 1) {
	    	text = MESSAGES.linesOfCode1;
	    } else {
	    	text = MESSAGES.linesOfCode2.replace('%1', String(lineCount));
	    }

	    lines.textContent = '';
	    lines.appendChild(document.createTextNode(text));

	    pre.textContent = code;

	    var text2: string;

	    if (true) {//HERE CHECK IF LAST LEVEL
	    	text2 = MESSAGES.nextLevel.replace('%1', String(1/*SUBSCRIBE WITH NEXT LEVEL*/));
	    } else {
	    	text2 = MESSAGES.finalLevel;
	    }

	    done.textContent = text2;

		this.changeOverlayState(true);
		this.popup.style.display = 'block';
	}

}