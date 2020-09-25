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
		crashSound: 'assets/maze/sounds/fail_pegman.mp3',
		crashType: CrashType.STOP
	},
	{
		sprite: 'assets/maze/images/astro.png',
	    tiles: 'assets/maze/images/tiles_astro.png',
	    marker: 'assets/maze/images/marker.png',
	    background: 'assets/maze/images/bg_astro.jpg',
	    look: '#fff',
	    winSound: 'assets/maze/sounds/win.mp3',
	    crashSound: 'assets/maze/sounds/fail_astro.mp3',
	    crashType: CrashType.SPIN
	},
	{
		sprite: 'assets/maze/images/panda.png',
	    tiles: 'assets/maze/images/tiles_panda.png',
	    marker: 'assets/maze/images/marker.png',
	    background: 'assets/maze/images/bg_panda.jpg',
	    look: '#000',
	    winSound: 'assets/maze/sounds/win.mp3',
	    crashSound: 'assets/maze/sounds/fail_panda.mp3',
	    crashType: CrashType.FALL
	}
];