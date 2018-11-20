# Tune

Audio Library, wrapper over Howlerjs, which gives for more robust functions such as easing

# Getting Started

Install via NPM 
```bash
$ npm i @kirinnee/tune
```

or 

Install via Yarn
```bash
$ yarn add @kirinnee/tune --prefer-offline
```

Using in browser

Attach scripts in `dist/` folder
```html
<script src="./dist/@kirinnee/tune.min.js"></script>
```

# Class Dependency
This package depends on
 - [@kirinnee/core](https://www.npmjs.com/package/@kirinnee/core)
 - [@kirinnee/kease](https://www.npmjs.com/package/@kirinnee/kease) 
 - [Howlerjs](https://howlerjs.com/)
 - [GSAP](https://www.npmjs.com/package/gsap)

**Setup dependecy** 
 ```typescript
//import depenedencies
import {Core, Kore } from "@kirinnee/core";
import {EaseFactory, EaseStrength, kEaseFactory} from "@kirinnee/kease";
import * as gsap from "gsap";
import {TweenLite} from "gsap";
import Howl from "howler";

 //@kirinnee/core /
let core:Core = new Kore();
core.ExtendPrimitives();

//@kirinnee/kease 
let easeFactory: EaseFactory = new kEaseFactory(gsap);
```

# Usage

Please ensure you have the dependencies ready to pass via dependency injection.

Life cycle is as follows:

`Create Dependency` => `Create Factories` => `Create Sound Groups` => `Create Sound`

## Creating Factories 
```typescript
//Create Group Factory
let sgFactory: ISoundGroupFactory = new SoundGroupFactory(core);
//Create Sound Factory
let gsFactory: IGameSoundFactory = new GameSoundFactory(core, Eases, Howl.Howl, TweenLite);
```

## Create Sound Group
Every sound must belong to a group. Group's volume change, all its child's volume changes too
```typescript
//Create Sound Group
let mainGroup: ISoundGroup = sgFactory.CreateSoundGroup("main");
```

## Simple Sound Creation
```typescript
//Create sound!
let music: IGameSound = gsFactory.CreateGameSound(mainGroup, "path/to/sound.mp3");
```

## Creation to pre-load
```typescript
let sounds: any = {
	music: {
		garden: gsFactory.CreateEmptySound(mainGroup, "path/to/garden.mp3"),
		sky: gsFactory.CreateEmptySound(mainGroup, "path/to/sky.mp3")
	},
	sprite: {
		biong: gsFactory.CreateEmptySound(mainGroup, "path/to/biong.mp3"),
		error: gsFactory.CreateEmptySound(mainGroup, "path/to/error.mp3")
		
	}
};

//Print the load percentage to console
sounds = gsFactory.LoadEmptySound(sounds, (event:SoundLoadEvent)=>{
	console.log(event.progress.line.percentage);
});
```

## Use Sound
```typescript
//Game sound pointer
let music:IGameSound = sound.music.garden;
//Play the music
music.Play();
//Pause the music
music.Pause();
//Stop the music
music.Stop();
//Change the Volume, between 0 and 1
music.SetVolume(0.5);
//Change the speed (1 is normal)
music.SetRate(1.5);
```

For others, please use the TypescriptDocs embed within the type definitions.



## Contributing
Please read [CONTRIBUTING.md](CONTRIBUTING.MD) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning 
We use [SemVer](https://semver.org/) for versioning. For the versions available, see the tags on this repository.

## Authors
* [kirinnee](mailto:kirinnee@gmail.com) 

## License
This project is licensed under MIT - see the [LICENSE.md](LICENSE.MD) file for details