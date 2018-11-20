import {kEasing} from "@kirinnee/kease";

interface IGameSound {
	
	//Playback
	readonly volume: number;
	readonly rate: number;
	
	/**
	 * Plays the sound, and executes the callback when the the sound stops, ends, or loops
	 *@param loop whether to loop the playback
	 * @param callback callback
	 */
	Play(loop?: boolean, callback?: Function): void;
	
	/**Pauses the sound */
	Pause(): void;
	
	/** Resumes the playback*/
	Resume(): void;
	
	/**Stops the sound, executes callback */
	Stop(): void;
	
	/**
	 * Play from select time
	 * @param seconds time to start from in seconds
	 * @param loop whether to loop to the start specified on end
	 * @param callback function to execute on end, stop or on loop
	 */
	PlayFrom(seconds: number, loop?: boolean, callback?: Function): void;
	
	/**
	 * Play the sound for a set amount of duration. executes callback when duration ends,when sound loops, or when stop is executed
	 * @param duration duration to play for
	 * @param loop whether to loop the start after duration ended
	 * @param callback function to execute when sound stops, ends or loops.
	 */
	PlayFor(duration: number, loop?: boolean, callback?: Function): void;
	
	/**
	 * Play from start time to end time. Executes callback at end time.
	 * @param start starting time
	 * @param end ending time
	 * @param loop whether to loop back to starting time after reaching ending time
	 * @param callback function to execute at ending time, or when stopped, or when looped
	 */
	PlayFromTo(start: number, end: number, loop?: boolean, callback?: Function): void;
	
	/**
	 * Play from starting time for a set duration. Executes callback at end of duration or when stopped, or when looped
	 * @param start time to start playing from
	 * @param duration duration to play for
	 * @param loop whether to loop on duration end
	 * @param callback function to execute onloop, duration end, or when stopped manually
	 */
	PlayFromFor(start: number, duration: number, loop?: boolean, callback?: Function): void;
	
	//Fades
	/**
	 * Increases the volume from 0 to 1. Have to be executed after play has been executed. Callback gets executed after the *fade ends*, not when the sound ends.
	 * @param duration the duration to fade in
	 * @param callback the function to execute after sound has faded in
	 * @param ease the interpolation of the fade in
	 */
	FadeIn(duration?: number, callback?: Function, ease?: kEasing): void;
	
	/**
	 * Increases the volume from 1 to 0. Have to be executed after play has been executed.
	 * Callback gets executed after the *fade ends*, not when the sound ends.
	 * Sound continues to play after it fades out, just at volume 0
	 * @param duration the duration to fade in
	 * @param callback the function to execute after sound has faded in
	 * @param ease the interpolation of the fade out
	 */
	FadeOut(duration?: number, callback?: Function, ease?: kEasing): void;
	
	//Volume
	/**
	 * Set the volume of the sound.
	 * @param volume volume of the sound
	 */
	SetVolume(volume: number): void;
	
	/**
	 * Animates the volume of the sound
	 * @param from start volume of the sound
	 * @param to end volume of the sound
	 * @param duration duration of the volume change
	 * @param callback function to execute after this volume animation ends
	 * @param ease easing change in sound
	 */
	Volume(from: number, to?: number, duration?: number, callback?: Function, ease?: kEasing): void;
	
	//Speed
	/**
	 * Changes the speed of the sound. 1 is normal speed.
	 * @param rate rate of the sound to change to
	 */
	SetRate(rate: number): void;
	
	/**
	 * Animates the rate of the sound.
	 * @param from the starting speed of the sound
	 * @param to the ending speed of the sound
	 * @param duration the duration of the speed change
	 * @param callback function to execute after the speed change is complete
	 * @param ease the animation interpolation of the change in speed
	 */
	Rate(from: number, to?: number, duration?: number, callback?: Function, ease?: kEasing): void;
	
	/**Returns the current playback position */
	Seek(): number;
	
	AdjustGroupVolume(volume: number): void;
	
}

export {IGameSound};