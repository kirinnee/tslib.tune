import {IGameSound} from "../..";
import {EaseFactory, kEasing} from "@kirinnee/kease";
import {Core} from "@kirinnee/core";
import {LoadFirer} from "../interface/IGameSoundFactory";

class GameSound implements IGameSound {
	
	public volume: number = 1;
	private howl: Howl;
	private groupVolume: number = 1;
	private speed: number = 1;
	private callback?: Function;
	private onEnd?: Function;
	private onStop?: Function;
	
	private easeFactory: EaseFactory;
	private readonly TweenLite: any;
	//internal flags
	private isPlaying: boolean = false;
	private isPaused: boolean = false;
	
	
	//EaseFactory, TweenLite, Howl Constructor
	constructor(core: Core, factory: EaseFactory, TweenLite: any, Howl: any, loadEvent: LoadFirer, source: string) {
		
		core.AssertExtend();
		
		this.easeFactory = factory;
		this.TweenLite = TweenLite;
		let sound = this;
		let prop: IHowlProperties = {
			src: source,
			volume: 1,
			loop: false,
			html5: false,
			rate: 1,
			onload: () => {
				loadEvent(true);
			},
			onloaderror: () => {
				loadEvent(false);
			},
			onend: function () {
				if (!this.loop()) {
					sound.isPlaying = false;
				}
				if (typeof sound.callback === "function") {
					let x = sound.callback;
					if (!this.loop()) sound.callback = undefined;
					x();
				}
				if (typeof sound.onEnd === "function") {
					let x = sound.onEnd;
					if (!this.loop()) sound.onEnd = undefined;
					x();
				}
			},
			onstop: function () {
				if (typeof sound.callback === "function") {
					let x = sound.callback;
					sound.callback = undefined;
					x();
				}
				if (typeof sound.onStop === "function") {
					let x = sound.onStop;
					sound.onStop = undefined;
					x();
				}
			}
		};
		this.howl = new Howl(prop);
		
	}
	
	get rate(): number {
		return this.howl.rate();
	}
	
	Play(loop: boolean = false, callback: Function = () => { }) {
		if (!this.isPlaying && !this.isPaused) {
			this.Clean();
			this.howl.loop(loop);
			this.howl.seek(0);
			this.howl.play();
			this.callback = callback;
			this.isPlaying = true;
		}
	}
	
	Resume() {
		if (!this.isPlaying && this.isPaused) {
			this.howl.play();
			this.isPlaying = true;
			this.isPaused = false;
		}
	}
	
	Pause() {
		if (this.isPlaying) {
			this.howl.pause();
			this.isPlaying = false;
			this.isPaused = true;
		}
	}
	
	Stop() {
		this.howl.stop();
		this.isPlaying = false;
		this.isPaused = false;
	}
	
	PlayFrom(seconds: number, loop?: boolean | undefined, callback?: Function | undefined) {
		if (!this.isPlaying && !this.isPaused) {
			this.Clean();
			this.howl.seek(seconds);
			this.howl.loop(false);
			this.howl.play();
			this.callback = callback;
			this.isPlaying = true;
			let sound = this;
			if (loop) {
				this.onEnd = function () {
					sound.PlayFrom(seconds, loop, callback);
				}
			}
		}
	}
	
	PlayFor(duration: number, loop?: boolean | undefined, callback?: Function | undefined) {
		if (!this.isPlaying && !this.isPaused) {
			this.Clean();
			this.howl.seek(0);
			this.howl.loop(false);
			this.howl.play();
			this.isPlaying = true;
			let sound = this;
			let interval = setInterval(function () {
				if (!sound.isPlaying && !sound.isPaused) {
					clearInterval(interval);
					if (typeof callback === "function") {
						callback();
					}
				}
				if (sound.Seek() >= duration) {
					if (typeof callback === "function") {
						callback();
					}
					if (loop) {
						sound.howl.seek(0);
					} else {
						clearInterval(interval);
						sound.Stop();
					}
				}
			}, 1);
		}
		
	}
	
	PlayFromTo(start: number, end: number, loop?: boolean | undefined, callback?: Function | undefined) {
		this.PlayFromFor(start, end - start, loop, callback);
	}
	
	PlayFromFor(start: number, duration: number, loop?: boolean | undefined, callback?: Function | undefined) {
		if (!this.isPlaying && !this.isPaused) {
			this.Clean();
			this.howl.seek(start);
			this.howl.loop(false);
			this.howl.play();
			this.isPlaying = true;
			let sound = this;
			let interval = setInterval(function () {
				if (!sound.isPlaying && !sound.isPaused) {
					clearInterval(interval);
					if (typeof callback === "function") {
						callback();
					}
				}
				if (sound.Seek() >= duration + start) {
					if (typeof callback === "function") {
						callback();
					}
					if (loop) {
						sound.howl.seek(start);
					} else {
						clearInterval(interval);
						sound.Stop();
					}
				}
			}, 1);
		}
	}
	
	FadeIn(duration?: number | undefined, callback?: Function | undefined, ease?: kEasing | undefined) {
		this.Volume(0, 1, duration, callback, ease);
	}
	
	FadeOut(duration?: number | undefined, callback?: Function | undefined, ease?: kEasing | undefined) {
		this.Volume(1, 0, duration, callback, ease);
	}
	
	SetRate(rate: number) {
		this.howl.rate(rate);
	}
	
	Rate(from: number, to: number = from, duration: number = 0, callback: Function = () => { }, ease: kEasing = this.easeFactory.Constant()) {
		this.TweenLite.fromTo(this, duration,
			{speed: from},
			{
				speed: to,
				immediateRender: true,
				onComplete: callback,
				onUpdate: () => {
					this.SetRate(this.speed);
				},
				ease: ease.Get()
			});
	}
	
	SetVolume(volume: number) {
		this.volume = volume.Clamp(0, 1);
		this.howl.volume(volume * this.groupVolume);
	}
	
	AdjustGroupVolume(newVolume: number) {
		this.groupVolume = newVolume;
		this.SetVolume(this.volume);
	}
	
	Volume(from: number, to: number = from, duration: number = 0, callback: Function = () => { }, ease: kEasing = this.easeFactory.Constant()) {
		this.TweenLite.fromTo(this, duration,
			{volume: from},
			{
				volume: to,
				immediateRender: true,
				onComplete: callback,
				onUpdate: () => {
					this.SetVolume(this.volume);
				},
				ease: ease.Get()
			});
	}
	
	Seek(): number {
		return this.howl.seek() as number;
	}
	
	private Clean() {
		this.callback = undefined;
		this.onEnd = undefined;
		this.onStop = undefined;
	}
}

export {GameSound};