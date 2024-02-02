declare module 'array-keyed-map';
interface ArrayKeyedMap<K, V> extends Map<K, V> {
  hasPrefix(key: K): boolean;
}
