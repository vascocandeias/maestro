export interface ScoreData {
	firstIndex: number,
	lastIndex: number,
	data: {
		id: string,
		i: number,
		score: number
	}[]
}

export interface ScoreModel {
	scores: ScoreData,
	thresholds: {
		tukey: number,
		gmm: number
	}
}

export interface MeteorModel {
	[score: string]: ScoreModel
}

export interface TimeSeriesModel {
	firstIndex: number,
	lastIndex: number,
	numTimeSlices: number,
	numAttributes: number,
	headers: string[],
	discrete: boolean | string[],
	data: {} // TODO: change
}

export interface GraphModel {
	alpha?: number,
	network: string,
	stationary: boolean,
	textLink: string,
	parameters: string[]
}

export interface BarChartModel {
	[attribute: string]: {
		[id: string]: DistributionModel[];
	}
}

export interface DistributionModel {
	value: string,
	frequency: number
}