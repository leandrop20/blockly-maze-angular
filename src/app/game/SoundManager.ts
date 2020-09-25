import { Skin } from '../interfaces/Skin';
import { SoundType } from '../enums/SoundType';

export class SoundManager {

	static workspace: any;

	static load(skin: Skin, workspace: any) {
		SoundManager.workspace = workspace;

		workspace.getAudioManager().load([skin.winSound], SoundType.WIN);
		workspace.getAudioManager().load([skin.crashSound], SoundType.FAIL);
	}

	static play(name: SoundType, vol: number = 0.5) {
		SoundManager.workspace.getAudioManager().play(name, vol);
	}

}