export interface FunctionRes extends Record<string | number, unknown> {
	readonly success: boolean;
	readonly status: number;
}

export interface FunctionFailed extends FunctionRes {
	readonly success: false;
}

export interface ValuableFunctionSuccess<T> extends FunctionRes {
	readonly success: true;
	readonly result: T;
}

export interface NoValuableFunctionSuccess extends FunctionRes {
	readonly success: true;
}

export type FunctionResult<T = void> = FunctionFailed | (T extends void ? NoValuableFunctionSuccess : ValuableFunctionSuccess<T>);
