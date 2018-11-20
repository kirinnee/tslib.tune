import {ISoundGroup} from "../..";

class EmptyGameSound {
	
	readonly rate: number = 1;
	readonly volume: number = 1;
	private readonly source: string;
	private readonly soundGroup: ISoundGroup;
	
	constructor(group: ISoundGroup, source: string) {
		this.source = source;
		this.soundGroup = group;
	}
	
	get Sauce() {
		return this.source;
	}
	
	get Group() {
		return this.soundGroup;
	}
}

export {EmptyGameSound};