import ArrayKeyedMap from 'array-keyed-map';
import { NamedBreadcrumb } from './BreadcrumbContext';

const arrayExtendsPrefix = <T>(prefix: Array<T>, array: Array<T>): boolean => {
  if (array.length <= prefix.length) return false;
  for (let i = 0; i < prefix.length; ++i) {
    if (prefix[i] !== array[i]) {
      return false;
    }
  }
  return true;
};

export class Breadcrumbs {
  #breadcrumbs: ArrayKeyedMap<string[], string> = new ArrayKeyedMap();

  constructor(data: NamedBreadcrumb[] = []) {
    for (const { path, name } of data) {
      this.#breadcrumbs.set(path.split('.'), name!);
    }
  }

  #copy(): Breadcrumbs {
    const result = new Breadcrumbs();
    result.#breadcrumbs = this.#breadcrumbs;
    return result;
  }

  get(path: string): string | undefined {
    return this.#breadcrumbs.get(path.split('.'));
  }

  addBreadcrumb({ path, name }: { path: string; name?: string }): Breadcrumbs {
    const explodedPath = path.split('.');
    const existingName = this.#breadcrumbs.get(explodedPath);
    if (name !== existingName) {
      const result = this.#copy();
      result.#breadcrumbs.set(explodedPath, name!);
      return result;
    } else {
      return this;
    }
  }

  deleteBreadcrumb(path: string): Breadcrumbs {
    const explodedPath = path.split('.');
    if (this.#breadcrumbs.get(explodedPath)) {
      const result = this.#copy();
      result.#breadcrumbs.delete(explodedPath);
      return result;
    } else {
      return this;
    }
  }

  truncateBreadcrumbs(path: string): Breadcrumbs {
    const explodedPath = path.split('.');
    const keysLongerThanPath = [...this.#breadcrumbs.keys()].filter((breadcrumbPath) =>
      arrayExtendsPrefix(explodedPath, breadcrumbPath)
    );
    if (keysLongerThanPath) {
      const result = new Breadcrumbs();
      const entriesLeft = [...this.#breadcrumbs.entries()].filter(
        ([breadcrumbPath, _]) => !arrayExtendsPrefix(explodedPath, breadcrumbPath)
      );
      for (const [key, value] of entriesLeft) {
        result.#breadcrumbs.set(key, value);
      }
      return result;
    } else {
      return this;
    }
  }

  clear(): Breadcrumbs {
    return new Breadcrumbs();
  }

  hasPrefix(path: string): boolean {
    return Boolean(path) && this.#breadcrumbs.hasPrefix(path.split('.'));
  }

  has(path: string): boolean {
    return this.#breadcrumbs.has(path.split('.'));
  }

  keys(): string[] {
    return [...this.#breadcrumbs.keys()].map((pathSegements) => pathSegements.join('.'));
  }

  entries(): [string, string][] {
    return [...this.#breadcrumbs.entries()].map(([pathSegments, name]) => [
      pathSegments.join('.'),
      name,
    ]);
  }
}
