import {EaseFactory, EaseStrength, kEaseFactory} from "@kirinnee/kease";
import * as gsap from "gsap";
import {TweenLite} from "gsap";
import {Core, Kore} from "@kirinnee/core";
import {
	GameSoundFactory,
	IGameSound,
	IGameSoundFactory,
	ISoundGroup,
	ISoundGroupFactory,
	SoundGroupFactory,
	SoundLoadEvent
} from "../../src";
import Howl from "howler";

import {CC, ConCurrent} from "@kirinnee/cc";


let core: Core = new Kore();
core.ExtendPrimitives();

let cc: CC = new ConCurrent();
cc.ExtendPrimitives();

let Eases: EaseFactory = new kEaseFactory(gsap);
let sgFactory: ISoundGroupFactory = new SoundGroupFactory(core);

let mainGroup: ISoundGroup = sgFactory.CreateSoundGroup("main");
let gsFactory: IGameSoundFactory = new GameSoundFactory(core, Eases, Howl.Howl, TweenLite);

let sounds: any = {
	music: {
		asuka: gsFactory.CreateEmptySound(mainGroup, "https://s3-ap-southeast-1.amazonaws.com/kirin.static.host/test/trimmedtest.mp3"),
		girlsLastTour: gsFactory.CreateEmptySound(mainGroup, "https://storage.googleapis.com/sophieyay/%E5%B0%91%E5%A5%B3%E7%B5%82%E6%9C%AB%E6%97%85%E8%A1%8C%20-Main%20Theme-.mp3")
	},
	sprite: {
		error: gsFactory.CreateEmptySound(mainGroup, "https://s3-ap-southeast-1.amazonaws.com/kirin.static.host/test/error.mp3"),
		fail: gsFactory.CreateEmptySound(mainGroup, "https://nosuch.moe")
		
	}
};

sounds = gsFactory.LoadEmptySound(sounds, (event: SoundLoadEvent) => {
	console.log(event);
	document.getElementById("load-pro")!.innerText = event.progress.tangential.over;
});

let error: IGameSound = sounds.sprite.error;
let asuka: IGameSound = sounds.music.asuka;

async function TimeTest(testName: string | string[], timeout: number, expected: any | any[], equal: any | any[], deep: boolean = false, before: Function = () => {}, after: Function = () => {}): Promise<void> {
	return new Promise<void>((resolve) => {
		let exe = () => {
			before();
			let ele: HTMLElement = document.getElementById("test-result")!;
			if (core.IsArray(testName)) {
				(testName as string[]).Each((s, i) => ExecuteTest(ele, s, expected[i], equal[i], deep));
			} else {
				ExecuteTest(ele, testName as string, expected, equal, deep);
			}
			after();
			resolve();
		};
		
		if (timeout > 0) {
			setTimeout(exe, timeout);
		} else {
			exe();
		}
	});
}

function ExecuteTest(ele: HTMLElement, testName: string, expected: any, equal: any, deep: boolean) {
	
	let robot: HTMLElement = document.getElementById("realtestresult")!;
	if (typeof expected === "function") {
		expected = expected();
	}
	if (typeof equal === "function") {
		equal = equal();
	}
	if (core.Eq(expected, equal, deep)) {
		ele.innerHTML += ` ${testName}: <span class="pass">PASS</span> <br>`;
		robot.innerText += "OK";
	} else {
		ele.innerHTML += `${testName}: <span class="fail">FAIL</span> Expected : ${expected}, Actual: ${equal}<br>`;
		robot.innerText += "BOO";
	}
}

async function Timeout(timeout: number, exe: Function = () => {}): Promise<void> {
	return new Promise<void>((resolve) => {
		setTimeout(() => {
			exe();
			resolve();
		}, timeout);
	});
}

async function TestSinglePlay(): Promise<void> {
	
	let testName: string = 'Single Play - Without loop, the callback should only be called once';
	let counts: number = 0;
	let gCount = () => {return counts};
	error.Play(false, () => {counts++});
	
	return await TimeTest(testName, 3000, 1, gCount, false);
}

async function LoopedPlay(): Promise<void> {
	
	let testName: string = 'Single Play- With loops, the callback should be called every loop, and when ended';
	let counts: number = 0;
	let gCount = () => {return counts};
	error.Play(true, () => {counts++});
	let before = () => {error.Stop();};
	return await TimeTest(testName, 7000, 7, gCount, false, before);
}

async function TestPause(): Promise<void> {
	
	let testName: string = 'Pause should stop the seek from moving';
	asuka.Play(false);
	let before = () => {asuka.Pause()};
	let after = () => {asuka.Stop()};
	let wrapper = () => {return asuka.Seek().RoundOff()};
	await Timeout(3000, before);
	return await TimeTest(testName, 5000, 3, wrapper, false, undefined, after);
}

async function TestStop(): Promise<void> {
	
	let testName = "Stop - Callback should have only been fired once";
	let count: number = 0;
	let gCount = () => {return count};
	asuka.Play(true, () => {count++});
	let before = () => {asuka.Stop()};
	await Timeout(100, before);
	return await TimeTest(testName, 5000, 1, gCount);
}

async function TestPlayFromWithLoop(): Promise<void> {
	let testName: string[] = ['PlayFrom with loop should loop twice', 'PlayFrom with loop should loop twice'];
	let count: number = 0;
	let gCount = () => {return count};
	asuka.PlayFrom(21, true, () => {count++});
	let before = () => {asuka.Pause()};
	let after = () => {asuka.Stop()};
	let wrap = () => {return asuka.Seek().RoundOff()};
	await Timeout(11000, before);
	return await TimeTest(testName, 4000, [2, 24], [gCount, wrap], false, undefined, after);
}

async function TestPlayFromSingle(): Promise<void> {
	let gCount = () => { return count};
	let count: number = 0;
	let exe = () => {asuka.PlayFrom(22, false, () => {count++})};
	
	exe();
	let test1: string = 'PlayFrom without loop callback should have been only fired once';
	await TimeTest(test1, 4000, 1, gCount);
	
	exe();
	let test2: string = 'PlayFrom without loop callback should have been only fired once more';
	await TimeTest(test2, 4000, 2, gCount);
	
	exe();
	let test3: string = 'PlayFrom without loop callback should have been only fired once more';
	await Timeout(1000, () => {asuka.Stop()});
	await TimeTest(test3, 1000, 3, gCount);
	
	exe();
	let test4: string = 'PlayFrom without loop still can run PlayFrom after stop is executed';
	return await TimeTest(test4, 3500, 4, gCount);
}

async function TestPlayForWithLoop(): Promise<void> {
	
	let count: number = 0;
	let gCount = () => {return count};
	asuka.PlayFor(2, true, () => {
		{
			count++
		}
	});
	let seek = () => {return asuka.Seek().RoundOff()};
	let pause = () => {asuka.Pause();};
	let stop = () => {asuka.Stop();};
	
	let test1: string[] = ["PlayFor with loop should have looped twice", "PlayFor when paused should be playing at correct seek"];
	await TimeTest(test1, 5000, [2, 1], [gCount, seek], false, pause);
	await Timeout(100);
	asuka.Resume();
	
	let test2: string[] = ['PlayFor with loop should have looped once', 'PlayFor when paused should be playing at correct seek'];
	await TimeTest(test2, 2300, [3, 1], [gCount, seek], false, pause, stop);
	await Timeout(1000);
	asuka.PlayFor(10, true);
	await Timeout(3000);
	asuka.Pause();
	
	let test3: string = 'PlayFor when paused should be playing at correct seek';
	return await TimeTest(test3, 2000, 3, seek, false, undefined, stop);
}

async function TestPlayForSingle(): Promise<void> {
	
	let count: number = 0;
	let gCount = () => {return count};
	asuka.PlayFor(2, false, () => {count++});
	
	let test1: string = 'PlayFor without loop Asuka only played once, and not repeat';
	await TimeTest(test1, 3000, 1, gCount);
	asuka.PlayFor(4, false, () => {count++});
	
	let pause = () => {asuka.Pause();};
	let seek = () => {return asuka.Seek().RoundOff();};
	let stop = () => {asuka.Stop();};
	let test2: string = 'PlayFor without loop , Asuka is at the correct seek after pausing - 2';
	await TimeTest(test2, 2000, 2, seek, false, pause, stop);
	return await Timeout(500);
}

async function TestPlayFromForWithLoop(): Promise<void> {
	
	let count: number = 0;
	let gCount = () => {return count};
	asuka.PlayFromFor(2, 2, true, () => {count++});
	
	let pause = () => {asuka.Pause()};
	let stop = () => {asuka.Stop()};
	let seek = () => {return asuka.Seek().RoundOff();};
	
	let test1: string[] = ['PlayFromFor with loop should have loop twice', 'PlayFromFor should have paused at 1second in'];
	
	await TimeTest(test1, 5000, [2, 3], [gCount, seek], false, pause, stop);
	await Timeout(500);
	
	let test2: string[] = ['PlayFromFor with loop should have stopped at correct seek', 'PlayFromFor should not have looped as it paused before it reaches'];
	asuka.PlayFromFor(3, 4, true, () => {count++});
	await TimeTest(test2, 1000, [4, 3], [seek, gCount], false, undefined, stop);
	return await Timeout(500);
}

async function TestPlayFromForSingle(): Promise<void> {
	let count: number = 0;
	let gCount = () => {return count};
	asuka.PlayFromFor(2, 2, false, () => {count++});
	
	let pause = () => {asuka.Pause()};
	let stop = () => {asuka.Stop()};
	let seek = () => {return asuka.Seek().RoundOff();};
	
	let test1: string = 'PlayFromFor should have not looped';
	await TimeTest(test1, 5000, 1, gCount);
	
	let test2: string = 'PlayFromFor without loop should pause at correct seek';
	asuka.PlayFromFor(2, 5, false);
	await TimeTest(test2, 1000, 3, seek, false, pause, stop);
	return await Timeout(500);
}

async function TestPlayFromToWithLoop(): Promise<void> {
	let count: number = 0;
	let gCount = () => {return count};
	asuka.PlayFromTo(2, 4, true, () => {count++});
	
	let pause = () => {asuka.Pause()};
	let stop = () => {asuka.Stop()};
	let seek = () => {return asuka.Seek().RoundOff();};
	
	let test1: string[] = ['PlayFromTo with loop should have loop twice', 'PlayFromTo should have paused at 1second in'];
	await TimeTest(test1, 5000, [2, 3], [gCount, seek], false, pause, stop);
	await Timeout(500);
	asuka.PlayFromTo(3, 7, true, () => {count++});
	
	let test2: string[] = ['PlayFromTo with loop should have stopped at correct seek', 'PlayFromTo should not have looped as it paused before it reaches'];
	await TimeTest(test2, 1000, [4, 3], [seek, gCount]);
	asuka.Stop();
	return await Timeout(500);
}

async function TestPlayFromToSingle(): Promise<void> {
	let pause = () => {asuka.Pause()};
	let stop = () => {asuka.Stop()};
	let seek = () => {return asuka.Seek().RoundOff();};
	
	let count: number = 0;
	let gCount = () => {return count};
	asuka.PlayFromTo(2, 4, false, () => {count++});
	
	let test1: string = 'PlayFromTo should have not looped';
	await TimeTest(test1, 5000, 1, gCount);
	asuka.PlayFromTo(2, 7, false);
	
	let test2: string = 'PlayFromTo without loop should pause at correct seek';
	await TimeTest(test2, 1000, 3, seek, false, pause, stop);
	return await Timeout(500);
	
}

async function TestFadeIn(): Promise<void> {
	
	let volume = () => {return asuka.volume};
	
	asuka.Play();
	asuka.FadeIn(2);
	await TimeTest('FadeIn should start with 0 volume', 0, asuka.volume, 0);
	await TimeTest('FadeIn should end with 1 volume', 2500, 1, volume);
	asuka.Stop();
	return await Timeout(500);
}

async function TestFadeOut(): Promise<void> {
	
	let volume = () => {return asuka.volume};
	
	asuka.Play();
	asuka.FadeOut(2);
	await TimeTest('FadeIn should start with 1 volume', 0, asuka.volume, 1);
	await TimeTest('FadeIn should end with 0 volume', 2500, 0, volume);
	asuka.Stop();
	return await Timeout(500);
}

async function TestVolumeAnimation(): Promise<void> {
	let volume = () => {return asuka.volume};
	asuka.Play();
	asuka.Volume(0.7, 0.3, 2);
	await TimeTest('Volume animation should start with 0.7 volume', 0, 0.7, volume);
	await TimeTest('Volume animation should end with 0.3 volume', 2500, 0.3, volume);
	asuka.Stop();
	return await Timeout(500);
}

async function TestRateAnimation(): Promise<void> {
	let rate = () => {return asuka.rate};
	
	asuka.Play();
	asuka.Rate(1, 1.25, 2, () => {}, Eases.EaseIn(EaseStrength.Exponential));
	await TimeTest('Rate should start with 1x', 0, 1, rate);
	await TimeTest('Rate should end with 1.25 x', 2500, 1.25, rate);
	asuka.Stop();
	return await Timeout(500);
	
}

document.getElementById("test-start")!.addEventListener('click', async () => {
	console.log("running test...");
	let tests: Function[] =
		[TestPlayFromSingle,
			TestSinglePlay
			, LoopedPlay
			, TestPause
			, TestStop
			, TestPlayFromWithLoop
			, TestPlayForWithLoop
			, TestPlayForSingle
			, TestPlayFromForWithLoop
			, TestPlayFromForSingle
			, TestPlayFromToWithLoop
			, TestPlayFromToSingle
			, TestFadeOut
			, TestFadeIn
			, TestVolumeAnimation
			, TestRateAnimation
		];
	await tests.Series(e => e()).then(() => console.log("done"));
	let end = document.createElement("div");
	end.setAttribute("id", "complete-signature");
	document.getElementsByTagName("body")[0].appendChild(end);
	
});





