import { CrashType } from '../enums/CrashType';

export interface Skin {

	sprite: string;// sprite: A 1029x51 set of 21 avatar images.
	tiles: string;// tiles: A 250x200 set of 20 map images.
	marker: string;// marker: A 20x34 goal image.
	background: string;// background: An optional 400x450 background image, or false.
	look: string;// look: Colour of sonar-like look icon.
	winSound: string;// winSound: List of sounds (in various formats) to play when the player wins.
	crashSound: string;// crashSound: List of sounds (in various formats) for player crashes.
	crashType: CrashType;//Behaviour when player crashes (stop, spin, or fall).
}