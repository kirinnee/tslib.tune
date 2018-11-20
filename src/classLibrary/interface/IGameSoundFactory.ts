import {IGameSound} from "./IGameSound ";
import {ISoundGroup} from "./ISoundGroup";
import {EmptyGameSound} from "../concrete/EmptyGameSound";

type EmptySoundRepository = { [s: string]: EmptyGameSound | EmptySoundRepository };
type GameSoundRepository = { [s: string]: IGameSound | GameSoundRepository };
type SoundLoadListener = (event: SoundLoadEvent) => void;
type LoadFirer = (success: boolean) => void;

interface IGameSoundFactory {
	
	/**
	 * Create Game Sound that can be used directly
	 * @param group Group the sound belongs to
	 * @param source Source (relative path) to use
	 * @constructor
	 */
	CreateGameSound(group: ISoundGroup, source: string): IGameSound
	
	/**
	 * Create Game Sound that cannot be used yet
	 * Bulk Register to pre-load event (to show loading bar and pre-download audio buffer
	 * @constructor
	 */
	CreateEmptySound(group: ISoundGroup, source: string): EmptyGameSound;
	
	/**
	 * Pre loads the empty sounds, allow people to use them
	 * @param sounds
	 * @param listener
	 * @constructor
	 */
	LoadEmptySound(sounds: EmptySoundRepository, listener?: SoundLoadListener): GameSoundRepository;
}


interface SoundLoadEvent {
	succeeded: number;
	total: number;
	failed: number;
	progress: ProgressCalculation;
}

interface ProgressCalculation {
	linear: ProgressFormat;
	tangential: ProgressFormat;
}

interface ProgressFormat {
	/**
	 * String in percentage with 2 decimal place
	 */
	percentage: string;
	
	/**
	 * String formatted as completed over total
	 * x/y
	 */
	over: string;
	
	/**
	 * Raw value in floating point
	 */
	value: number;
}

export {
	
	IGameSoundFactory,
	SoundLoadEvent,
	ProgressCalculation,
	ProgressFormat,
	SoundLoadListener,
	EmptySoundRepository,
	GameSoundRepository,
	LoadFirer
};