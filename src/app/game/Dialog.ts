export class Dialog {	

	private origin: any;
	private dialogDispose: Function;

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