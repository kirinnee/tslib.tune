import {IGameSound, IGameSoundFactory, ISoundGroup} from "../..";
import {GameSound} from "./GameSound";
import {EaseFactory} from "@kirinnee/kease";
import {EmptyGameSound} from "./EmptyGameSound";
import {
	EmptySoundRepository,
	GameSoundRepository,
	LoadFirer,
	SoundLoadEvent,
	SoundLoadListener
} from "../interface/IGameSoundFactory";
import {Core} from "@kirinnee/core";


class GameSoundFactory implements IGameSoundFactory {
	
	private readonly core: Core;
	private readonly howl: any;
	private readonly factory: EaseFactory;
	private readonly TweenLite: any;
	
	constructor(core: Core, factory: EaseFactory, Howl: any, TweenLite: any) {
		core.AssertExtend();
		this.core = core;
		this.howl = Howl;
		this.TweenLite = TweenLite;
		this.factory = factory;
	}
	
	CreateGameSound(group: ISoundGroup, source: string, loadEvent: LoadFirer = () => {}): IGameSound {
		let sound: IGameSound = new GameSound(this.core, this.factory, this.TweenLite, this.howl, loadEvent, source);
		group.RegisterGameSound(sound);
		return sound;
	}
	
	CreateEmptySound(group: ISoundGroup, source: string): EmptyGameSound {
		return new EmptyGameSound(group, source);
	}
	
	LoadEmptySound(sounds: EmptySoundRepository, listener: SoundLoadListener = () => {}): GameSoundRepository {
		let map: Map<string, EmptyGameSound> = this.core.FlattenClass<EmptyGameSound>(sounds, EmptyGameSound);
		
		let total: number = map.size;
		let pass: number = 0;
		let fail: number = 0;
		
		let fact = this;
		
		return map.MapValue(v => this.CreateGameSound(v.Group, v.Sauce, (success: boolean) => {
			console.log(success);
			if (success) {
				pass++;
			} else {
				fail++;
			}
			let event: SoundLoadEvent = fact.ConstructEventObject(fact, total, pass, fail);
			listener(event);
		})).AsObject() as GameSoundRepository;
	}
	
	
	private ConstructEventObject(fact: GameSoundFactory, total: number, pass: number, fail: number): SoundLoadEvent {
		let completed: number = pass + fail;
		let over: string = `${completed}/${total}`;
		return {
			failed: fail,
			succeeded: pass,
			total: total,
			progress: {
				linear: {
					percentage: `${(completed / total).toFixed(2)}%`,
					over: over,
					value: completed / total
				},
				tangential: {
					percentage: `${fact.tangentProgess(completed, total, 5).toFixed(2)}%`,
					over: over,
					value: fact.tangentProgess(completed, total, 5)
				}
				
			}
		}
	}
	
	private tangentProgess(over: number, under: number, curvature: number) {
		return Math.tan(over * (Math.atan(curvature)) / under) / curvature;
	}
}


export {GameSoundFactory};