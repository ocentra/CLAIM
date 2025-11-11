import { afterEach, describe, expect, it } from 'vitest';
import { configureSerialization, deserialize, serialize, serializable } from '../Serializable';

class ChildConfig {
  static schemaVersion = 1;

  @serializable()
  value = 1;
}

class ParentConfig {
  static schemaVersion = 1;

  @serializable({ elementType: ChildConfig })
  children: ChildConfig[] = [new ChildConfig()];

  @serializable()
  label = 'test';
}

describe('Serializable utilities', () => {
  afterEach(() => {
    configureSerialization({ deepClone: true, freezeResults: true, freezeInstances: false });
  });

  it('serializes nested serializable objects', () => {
    const parent = new ParentConfig();
    parent.children[0].value = 42;

    const json = serialize(parent);

    expect(json.label).toBe('test');
    expect(Array.isArray(json.children)).toBe(true);
    expect((json.children as Array<Record<string, unknown>>)[0].value).toBe(42);
    expect((json.children as Array<Record<string, unknown>>)[0].__schemaVersion).toBe(1);
  });

  it('deserializes nested serializable objects', () => {
    const json = {
      label: 'loaded',
      children: [{ value: 99, __schemaVersion: 1 }],
      __schemaVersion: 1,
    };

    const config = deserialize(ParentConfig, json);

    expect(config.label).toBe('loaded');
    expect(config.children[0]).toBeInstanceOf(ChildConfig);
    expect(config.children[0].value).toBe(99);
  });

  it('supports immutability toggles', () => {
    configureSerialization({ freezeResults: false, freezeInstances: true });

    const json = serialize(new ParentConfig());
    expect(Object.isFrozen(json)).toBe(false);

    const instance = deserialize(ParentConfig, json as Record<string, unknown>);
    expect(Object.isFrozen(instance)).toBe(true);
  });
});

