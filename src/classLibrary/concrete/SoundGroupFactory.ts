import {Core} from "@kirinnee/core";
import {ISoundGroup, ISoundGroupFactory} from "../..";
import {SoundGroup} from "./SoundGroup";

class SoundGroupFactory implements ISoundGroupFactory {
	
	private readonly core: Core;
	
	constructor(core: Core) {
		core.AssertExtend();
		this.core = core;
	}
	
	CreateSoundGroup(id: string): ISoundGroup {
		return new SoundGroup(this.core, id);
	}
}

export {SoundGroupFactory};