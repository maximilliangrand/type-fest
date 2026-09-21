import type {BuiltIns} from './internal/index.d.ts';
import type {IsNever} from './is-never.d.ts';

/**
Create a deep version of another type where leaf values also accept `undefined`, keeping object containers present.

Unlike {@link PartialDeep}, this type keeps required properties required. It widens primitive values, `Date`, `RegExp`, functions, and constructors to accept `undefined`, while preserving the structure of nested objects, arrays, tuples, maps, sets, and promises. Optional and `readonly` modifiers are preserved.

Use this to model form state that retains its nested structure while individual fields are cleared or have not yet been populated.

@example
```
import type {UndefinableDeep} from 'type-fest';

type Settings = {
	textEditor: {
		fontSize: number;
		fontColor: string;
	};
	autosave: boolean;
};

type DraftSettings = UndefinableDeep<Settings>;
//=> {
// 	textEditor: {
// 		fontSize: number | undefined;
// 		fontColor: string | undefined;
// 	};
// 	autosave: boolean | undefined;
// }

const draft: DraftSettings = {
	textEditor: {
		fontSize: undefined, // Present but not yet chosen
		fontColor: undefined,
	},
	autosave: undefined,
};
```

The transformation recurses into object properties and collection elements. For example, `string[]` becomes `Array<string | undefined>`, and `Promise<string>` becomes `Promise<string | undefined>`. An object-valued property or collection element stays an object unless its original type already includes `undefined`.

Functions and constructors are leaves: their signatures and attached properties are preserved unchanged, including generic and overloaded signatures. Weak collections exclude `undefined` from transformed keys because it is not a valid `WeakMap` key or `WeakSet` item. A `never` leaf becomes `undefined`.

@see {@link UndefinedOnPartialDeep}

@category Object
@category Array
@category Set
@category Map
*/
export type UndefinableDeep<Type> = IsNever<Type> extends true
	? undefined
	: Type extends BuiltIns | Function
		? Type | undefined
		: Type extends Map<infer KeyType, infer ValueType>
			? Map<UndefinableDeep<KeyType>, UndefinableDeep<ValueType>>
			: Type extends Set<infer ItemType>
				? Set<UndefinableDeep<ItemType>>
				: Type extends ReadonlyMap<infer KeyType, infer ValueType>
					? ReadonlyMap<UndefinableDeep<KeyType>, UndefinableDeep<ValueType>>
					: Type extends ReadonlySet<infer ItemType>
						? ReadonlySet<UndefinableDeep<ItemType>>
						: Type extends WeakMap<infer KeyType, infer ValueType>
							? WeakMap<Extract<UndefinableDeep<KeyType>, WeakKey>, UndefinableDeep<ValueType>>
							: Type extends WeakSet<infer ItemType>
								? WeakSet<Extract<UndefinableDeep<ItemType>, WeakKey>>
								: Type extends Promise<infer ValueType>
									? Promise<UndefinableDeep<ValueType>>
									: Type extends object
										? {[KeyType in keyof Type]: UndefinableDeep<Type[KeyType]>}
										: Type | undefined;

export {};
