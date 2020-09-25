import { Skin } from '../../interfaces/Skin';
import { CrashType } from '../../enums/CrashType';

export const SKINS: Skin[] = [
	{
		sprite: 'assets/maze/images/pegman.png',
		tiles: 'assets/maze/images/tiles_pegman.png',
		marker: 'assets/maze/images/marker.png',
		background: null,
		look: '#000',
		winSound: 'assets/maze/sounds/win.mp3',
		crashSound: 'assets/maze/sounds/fail.mp3',
		crashType: CrashType.STOP
	},
	{
		sprite: 'assets/maze/astro.png',
	    tiles: 'assets/maze/tiles_astro.png',
	    marker: 'assets/maze/marker.png',
	    background: 'assets/maze/bg_astro.jpg',
	    look: '#fff',
	    winSound: 'assets/maze/win.mp3',
	    crashSound: 'assets/maze/fail_astro.mp3',
	    crashType: CrashType.SPIN
	},
	{
		sprite: 'assets/maze/panda.png',
	    tiles: 'assets/maze/tiles_panda.png',
	    marker: 'assets/maze/marker.png',
	    background: 'assets/maze/bg_panda.jpg',
	    look: '#000',
	    winSound: 'assets/maze/win.mp3',
	    crashSound: 'assets/maze/fail_panda.mp3',
	    crashType: CrashType.FALL
	}
];