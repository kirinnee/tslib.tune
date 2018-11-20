import {IGameSound} from "./IGameSound ";

interface ISoundGroup {
	RegisterGameSound(gameSounds: IGameSound[] | IGameSound): void;
	
	SetVolume(volume: number): void;
	
	IncreaseVolume(volume: number): void;
	
	DecreaseVolume(volume: number): void;
}

export {ISoundGroup};