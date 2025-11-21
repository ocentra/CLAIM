import 'reflect-metadata';

export const SCHEMA_VERSION_KEY = '__schemaVersion';
const SERIALIZABLE_METADATA_KEY = Symbol('serializableFields');

type SerializableConstructor<T = unknown> = new () => T;
type SchemaAwareConstructor<T> = SerializableConstructor<T> & {
  schemaVersion?: number;
  migrate?: (data: Record<string, unknown>) => Record<string, unknown>;
};

interface SerializationRuntimeOptions {
  deepClone: boolean;
  freezeResults: boolean;
  freezeInstances: boolean;
}

const runtimeOptions: SerializationRuntimeOptions = {
  deepClone: true,
  freezeResults: true,
  freezeInstances: false,
};

const metadataCache = new WeakMap<SerializableConstructor, SerializableField[]>();
const serializableConstructors = new WeakSet<SerializableConstructor>();

export interface SerializableOptions {
  label?: string;
  min?: number;
  max?: number;
  step?: number;
  group?: string;
  inputType?: 'number' | 'angle' | 'string' | 'boolean';
  /**
   * When provided, array values will be deserialized using the supplied constructor.
   */
  elementType?: SerializableConstructor;
}

export interface SerializableField {
  key: string;
  options: SerializableOptions;
  defaultValue: unknown;
  designType?: SerializableConstructor | ArrayConstructor;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isSerializableConstructor = (ctor: unknown): ctor is SerializableConstructor =>
  typeof ctor === 'function' && serializableConstructors.has(ctor as SerializableConstructor);

const deepClone = (value: unknown, seen = new WeakMap<object, unknown>()): unknown => {
  if (Array.isArray(value)) {
    return value.map(item => deepClone(item, seen));
  }

  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  if (isRecord(value)) {
    if (seen.has(value)) {
      return seen.get(value);
    }
    const copy: Record<string, unknown> = {};
    seen.set(value, copy);
    for (const [key, entry] of Object.entries(value)) {
      copy[key] = deepClone(entry, seen);
    }
    return copy;
  }

  return value;
};

const deepFreeze = (value: unknown, seen = new WeakSet<object>()): unknown => {
  if (Array.isArray(value)) {
    if (!seen.has(value)) {
      seen.add(value);
      value.forEach(item => deepFreeze(item, seen));
    }
    return Object.freeze(value);
  }

  if (isRecord(value)) {
    if (seen.has(value)) {
      return value;
    }
    seen.add(value);
    Object.entries(value).forEach(([, entry]) => {
      deepFreeze(entry, seen);
    });
    return Object.freeze(value);
  }

  return value;
};

export const configureSerialization = (
  options: Partial<SerializationRuntimeOptions>
): void => {
  Object.assign(runtimeOptions, options);
};

// Property decorator function type for experimental decorators
// Using 'any' is necessary for experimental decorators to work with all property types,
// including properties with definite assignment assertion (!)
/* eslint-disable @typescript-eslint/no-explicit-any */
export function serializable(options: SerializableOptions = {}): any {
  return function (
    target: any,
    propertyKey: string | symbol
  ): any {
    const key = typeof propertyKey === 'string' ? propertyKey : String(propertyKey);
    const constructor = target.constructor as SerializableConstructor;
    serializableConstructors.add(constructor);

    const existing =
      (Reflect.getMetadata(
        SERIALIZABLE_METADATA_KEY,
        constructor
      ) as SerializableField[] | undefined) ?? [];

    // Cast target to record to access property values
    // Properties may be undefined at decorator evaluation time
    const targetRecord = target as Record<string, unknown>;
    const designType = Reflect.getMetadata('design:type', target, propertyKey) as
      | SerializableConstructor
      | ArrayConstructor
      | undefined;

    existing.push({
      key,
      options,
      defaultValue: targetRecord[key],
      designType,
    });

    Reflect.defineMetadata(SERIALIZABLE_METADATA_KEY, existing, constructor);
    metadataCache.set(constructor, existing);
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export function getSerializableFields<T>(
  constructor: SerializableConstructor<T>
): SerializableField[] {
  const cached = metadataCache.get(constructor);
  if (cached) {
    return cached;
  }

  const fields =
    (Reflect.getMetadata(SERIALIZABLE_METADATA_KEY, constructor) as SerializableField[] | undefined) ??
    [];
  metadataCache.set(constructor, fields);
  return fields;
}

const serializeValue = (
  value: unknown,
  elementType: SerializableConstructor | undefined,
  visited: WeakSet<object>
): unknown => {
  if (value === null || value === undefined) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map(entry =>
      serializeValue(entry, elementType, visited)
    );
  }

  if (isRecord(value)) {
    if (visited.has(value)) {
      throw new Error('Circular reference detected while serializing object graph.');
    }
    visited.add(value);

    const ctor = (value as { constructor?: SerializableConstructor }).constructor;
    if (ctor && isSerializableConstructor(ctor)) {
      return serializeInternal(value, visited);
    }

    const cloned = runtimeOptions.deepClone ? (deepClone(value) as Record<string, unknown>) : { ...value };
    visited.delete(value);
    return cloned;
  }

  return value;
};

const serializeInternal = <T>(instance: T, visited: WeakSet<object>): Record<string, unknown> => {
  const ctor = (instance as { constructor: SchemaAwareConstructor<T> }).constructor;
  serializableConstructors.add(ctor);
  const fields = getSerializableFields(ctor);
  const source = instance as Record<string, unknown>;
  const result: Record<string, unknown> = {};

  for (const field of fields) {
    const value = source[field.key];
    result[field.key] = serializeValue(value, field.options.elementType, visited);
  }

  if (typeof ctor.schemaVersion === 'number') {
    result[SCHEMA_VERSION_KEY] = ctor.schemaVersion;
  }

  return runtimeOptions.freezeResults ? (deepFreeze(result) as Record<string, unknown>) : result;
};

export function serialize<T>(instance: T): Record<string, unknown> {
  const visited = new WeakSet<object>();
  return serializeInternal(instance, visited);
}

const deserializeArray = (
  raw: unknown,
  elementType?: SerializableConstructor
): unknown => {
  if (!Array.isArray(raw)) {
    return raw;
  }

  if (elementType && isSerializableConstructor(elementType)) {
    return raw.map(item =>
      isRecord(item) ? deserialize(elementType, item as Record<string, unknown>) : item
    );
  }

  return runtimeOptions.deepClone ? deepClone(raw) : [...raw];
};

const deserializeValue = (
  rawValue: unknown,
  field: SerializableField
): unknown => {
  if (rawValue === undefined) {
    return undefined;
  }

  if (Array.isArray(rawValue)) {
    return deserializeArray(rawValue, field.options.elementType);
  }

  if (isRecord(rawValue)) {
    if (field.options.elementType && isSerializableConstructor(field.options.elementType)) {
      return deserialize(field.options.elementType, rawValue as Record<string, unknown>);
    }

    if (field.designType && isSerializableConstructor(field.designType)) {
      return deserialize(field.designType, rawValue as Record<string, unknown>);
    }

    return runtimeOptions.deepClone ? deepClone(rawValue) : { ...rawValue };
  }

  return rawValue;
};

export function deserialize<T>(
  cls: SerializableConstructor<T>,
  json: Record<string, unknown>
): T {
  const schemaAwareCtor = cls as SchemaAwareConstructor<T>;
  const instance = new cls();
  const target = instance as Record<string, unknown>;

  let raw = runtimeOptions.deepClone ? (deepClone(json) as Record<string, unknown>) : { ...json };
  const incomingVersion = raw[SCHEMA_VERSION_KEY];
  delete raw[SCHEMA_VERSION_KEY];

  if (typeof schemaAwareCtor.schemaVersion === 'number') {
    if (incomingVersion === undefined) {
      console.warn(
        `[Serializable] Missing schema version for ${schemaAwareCtor.name}; expected ${schemaAwareCtor.schemaVersion}.`
      );
    } else if (incomingVersion !== schemaAwareCtor.schemaVersion) {
      if (typeof schemaAwareCtor.migrate === 'function') {
        raw = schemaAwareCtor.migrate({
          ...raw,
          [SCHEMA_VERSION_KEY]: incomingVersion,
        });
      } else {
        console.warn(
          `[Serializable] Schema version mismatch for ${schemaAwareCtor.name}. ` +
            `Found ${incomingVersion}, expected ${schemaAwareCtor.schemaVersion}.`
        );
      }
    }
  }

  const fields = getSerializableFields(cls);
  for (const field of fields) {
    if (Object.prototype.hasOwnProperty.call(raw, field.key)) {
      const value = deserializeValue(raw[field.key], field);
      if (value !== undefined) {
        target[field.key] = value;
      }
    } else if (field.defaultValue !== undefined) {
      target[field.key] =
        runtimeOptions.deepClone && isRecord(field.defaultValue)
          ? deepClone(field.defaultValue)
          : field.defaultValue;
    }
  }

  if (runtimeOptions.freezeInstances) {
    deepFreeze(instance);
  }

  return instance;
}
