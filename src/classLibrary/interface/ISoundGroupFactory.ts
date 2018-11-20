import {ISoundGroup} from "./ISoundGroup";

interface ISoundGroupFactory {
	CreateSoundGroup(id: string): ISoundGroup;
}

export {ISoundGroupFactory};