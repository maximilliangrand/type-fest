import {expectAssignable, expectNotAssignable, expectType} from 'tsd';
import type {IsEqual, UndefinableDeep} from '../index.d.ts';

// Leaf values accept undefined, but required object containers stay present.
expectType<UndefinableDeep<{a: string; b: number}>>({} as {a: string | undefined; b: number | undefined});
expectType<UndefinableDeep<{a: {b: {c: string}}}>>({} as {a: {b: {c: string | undefined}}});
expectNotAssignable<UndefinableDeep<{a: {b: string}}>>({a: undefined});
expectNotAssignable<UndefinableDeep<{a: {b: string}}>>({});
expectNotAssignable<UndefinableDeep<{a: {b: string}}>>({a: {}});

// Optionality, explicit undefined unions, and readonly modifiers are preserved.
expectType<UndefinableDeep<{a?: string; readonly b: number}>>({} as {a?: string | undefined; readonly b: number | undefined});
expectType<IsEqual<UndefinableDeep<{readonly a: {b: string}}>, {readonly a: {b: string | undefined}}>>(true);
expectAssignable<UndefinableDeep<{a?: string}>>({a: undefined});
expectType<UndefinableDeep<{a: {b: string} | undefined}>>({} as {a: {b: string | undefined} | undefined});
expectType<UndefinableDeep<{a?: {b: string}}>>({} as {a?: {b: string | undefined} | undefined});
expectNotAssignable<UndefinableDeep<{a: string}>>({});

// Built-ins are leaves, both at the top level and inside objects.
expectType<UndefinableDeep<{a: Date; b: RegExp}>>({} as {a: Date | undefined; b: RegExp | undefined});
expectType<UndefinableDeep<string>>({} as string | undefined);
expectType<UndefinableDeep<number>>({} as number | undefined);
expectType<UndefinableDeep<boolean>>({} as boolean | undefined);
expectType<UndefinableDeep<bigint>>({} as bigint | undefined);
expectType<UndefinableDeep<symbol>>({} as symbol | undefined);
expectType<UndefinableDeep<Date>>({} as Date | undefined);
expectType<UndefinableDeep<RegExp>>({} as RegExp | undefined);
expectType<UndefinableDeep<null>>(undefined as null | undefined);
expectType<UndefinableDeep<undefined>>(undefined);
declare const voidLeaf: void | undefined;
expectType<UndefinableDeep<void>>(voidLeaf);

// Index signatures and unions recurse into object values without discarding containers.
expectType<UndefinableDeep<{[key: string]: {a: number}}>>({} as {[key: string]: {a: number | undefined}});
expectType<UndefinableDeep<{a: number} | {b: string}>>({} as {a: number | undefined} | {b: string | undefined});
expectType<UndefinableDeep<string | {a: number}>>({} as string | {a: number | undefined} | undefined);

// Arrays widen primitive elements; object elements remain present.
expectType<UndefinableDeep<string[]>>({} as Array<string | undefined>);
expectType<UndefinableDeep<readonly string[]>>({} as ReadonlyArray<string | undefined>);
expectType<UndefinableDeep<ReadonlyArray<{a: number}>>>({} as ReadonlyArray<{a: number | undefined}>);
expectType<UndefinableDeep<{a: Array<{b: number}>}>>({} as {a: Array<{b: number | undefined}>});
expectNotAssignable<UndefinableDeep<{a: string[]}>>({a: undefined});
expectNotAssignable<UndefinableDeep<Array<{a: number}>>>([undefined]);

// Homomorphic tuple mapping preserves labels, readonly, optional, and rest elements.
expectType<UndefinableDeep<[]>>({} as []);
expectType<UndefinableDeep<readonly []>>({} as readonly []);
expectType<UndefinableDeep<[name: string, count: number]>>({} as [name: string | undefined, count: number | undefined]);
expectType<UndefinableDeep<[string, number?]>>({} as [string | undefined, (number | undefined)?]);
expectType<UndefinableDeep<[string, ...number[]]>>({} as [string | undefined, ...Array<number | undefined>]);
expectType<UndefinableDeep<[...string[], number]>>({} as [...Array<string | undefined>, number | undefined]);
expectType<UndefinableDeep<readonly [string, {a: number}]>>({} as readonly [string | undefined, {a: number | undefined}]);
expectAssignable<UndefinableDeep<[string, number?]>>([undefined, undefined]);
expectNotAssignable<UndefinableDeep<[string, number]>>([undefined]);
expectNotAssignable<UndefinableDeep<[{a: number}]>>([undefined]);

// Collections widen primitive keys, values, and items consistently.
expectType<UndefinableDeep<Map<string, number>>>({} as Map<string | undefined, number | undefined>);
expectType<UndefinableDeep<ReadonlyMap<string, {a: number}>>>({} as ReadonlyMap<string | undefined, {a: number | undefined}>);
expectType<UndefinableDeep<Map<{a: number}, string>>>({} as Map<{a: number | undefined}, string | undefined>);
expectType<UndefinableDeep<Set<string>>>({} as Set<string | undefined>);
expectType<UndefinableDeep<ReadonlySet<string>>>({} as ReadonlySet<string | undefined>);
expectType<UndefinableDeep<Set<{a: number}>>>({} as Set<{a: number | undefined}>);
expectType<UndefinableDeep<ReadonlySet<{a: number}>>>({} as ReadonlySet<{a: number | undefined}>);
expectNotAssignable<UndefinableDeep<{a: Map<string, number>}>>({a: undefined});
expectNotAssignable<UndefinableDeep<{a: Set<string>}>>({a: undefined});

// Weak collections cannot acquire undefined keys, even when their keys are leaves.
expectType<UndefinableDeep<WeakMap<{k: string}, number>>>({} as WeakMap<{k: string | undefined}, number | undefined>);
expectType<UndefinableDeep<WeakMap<Date, RegExp>>>({} as WeakMap<Date, RegExp | undefined>);
expectType<UndefinableDeep<WeakMap<symbol, string>>>({} as WeakMap<symbol, string | undefined>);
expectType<UndefinableDeep<WeakSet<{a: number}>>>({} as WeakSet<{a: number | undefined}>);
expectType<UndefinableDeep<WeakSet<RegExp>>>({} as WeakSet<RegExp>);
expectType<UndefinableDeep<WeakSet<symbol>>>({} as WeakSet<symbol>);
expectType<UndefinableDeep<WeakSet<Date | {a: number}>>>({} as WeakSet<Date | {a: number | undefined}>);
expectType<UndefinableDeep<WeakSet<never>>>({} as WeakSet<never>);
expectType<UndefinableDeep<WeakMap<never, string>>>({} as WeakMap<never, string | undefined>);
expectType<UndefinableDeep<WeakSet<() => void>>>({} as WeakSet<() => void>);

// Promise containers remain present, while primitive fulfillment values widen.
expectType<UndefinableDeep<Promise<string>>>({} as Promise<string | undefined>);
expectType<UndefinableDeep<Promise<{a: number}>>>({} as Promise<{a: number | undefined}>);
expectNotAssignable<UndefinableDeep<{a: Promise<string>}>>({a: undefined});

// Callable leaves retain their complete signatures and attached properties.
type FunctionWithProperties = {(a1: string, a2: number): boolean; p1: string; readonly p2: {q: number}};
expectType<UndefinableDeep<FunctionWithProperties>>({} as FunctionWithProperties | undefined);
expectType<UndefinableDeep<(value: string) => number>>({} as ((value: string) => number) | undefined);
type GenericFunction = {<Value>(value: Value): Value; description: string};
declare const genericFunction: UndefinableDeep<GenericFunction>;
expectType<GenericFunction | undefined>(genericFunction);
if (genericFunction) {
	expectType<'literal'>(genericFunction('literal'));
	expectType<123>(genericFunction(123));
	expectType<string>(genericFunction.description);
}

type OverloadedFunction = {(value: string): string; (value: number): number; description: string};
declare const overloadedFunction: UndefinableDeep<OverloadedFunction>;
expectType<OverloadedFunction | undefined>(overloadedFunction);
if (overloadedFunction) {
	expectType<string>(overloadedFunction('value'));
	expectType<number>(overloadedFunction(1));
	expectType<string>(overloadedFunction.description);
}

// Concrete, abstract, and generic constructors are leaves too.
type Constructor = new (value: string) => {value: string};
type AbstractConstructor = abstract new (value: string) => {value: string};
type GenericConstructor = {description: string; new<Value>(value: Value): {value: Value}};
expectType<UndefinableDeep<Constructor>>({} as Constructor | undefined);
expectType<UndefinableDeep<AbstractConstructor>>({} as AbstractConstructor | undefined);
declare const GenericConstructorValue: UndefinableDeep<GenericConstructor>;
expectType<GenericConstructor | undefined>(GenericConstructorValue);
if (GenericConstructorValue) {
	expectType<{value: string}>(new GenericConstructorValue('value'));
	expectType<string>(GenericConstructorValue.description);
}

// An impossible leaf can be cleared; unknown and any retain their existing breadth.
expectType<UndefinableDeep<never>>(undefined);
expectType<UndefinableDeep<{a: never}>>({} as {a: undefined});
expectType<UndefinableDeep<never[]>>({} as undefined[]);
expectType<UndefinableDeep<unknown>>({} as unknown);
expectType<UndefinableDeep<any>>({} as any);
