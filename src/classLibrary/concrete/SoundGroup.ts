import {IGameSound, ISoundGroup} from "../..";
import {Core} from "@kirinnee/core";

class SoundGroup implements ISoundGroup {
	
	private volume: number;
	
	private readonly id: string;
	private sounds: IGameSound[];
	private readonly core: Core;
	
	constructor(core: Core, id: string) {
		core.AssertExtend();
		this.core = core;
		this.id = id;
		this.volume = 1;
		this.sounds = [];
	}
	
	get ID(): string {
		return this.id;
	}
	
	RegisterGameSound(gameSounds: IGameSound[] | IGameSound) {
		let sounds: IGameSound[] = this.core.WrapArray(gameSounds);
		this.sounds = this.sounds.concat(sounds);
	}
	
	SetVolume(volume: number) {
		this.volume = volume.Clamp(0, 1);
		this.UpdateVolume();
	}
	
	IncreaseVolume(volume: number) {
		this.SetVolume(this.volume + volume);
	}
	
	DecreaseVolume(volume: number) {
		this.SetVolume(this.volume - volume);
	}
	
	private UpdateVolume() {
		this.sounds.Map(s => s.AdjustGroupVolume(this.volume));
	}
	
}

export {SoundGroup};