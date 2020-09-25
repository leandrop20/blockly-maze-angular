export class Popup {

	private static instance: Popup;

	static init(popup: any, workspace: any) {
		Popup.instance = new Popup();
		Popup.instance.popup = popup;
		Popup.instance.workspace = workspace;
		Popup.instance.isOpened = false;
	}

	static show() {
		Popup.instance.show();
	}

	private popup: any;
	private workspace: any;
	private isOpened: boolean;

	show() {
		this.isOpened = true;

		var overlay: any = this.popup.children[0];
		overlay.style.opacity = 0.3;
		this.popup.style.display = 'block';
	}

}