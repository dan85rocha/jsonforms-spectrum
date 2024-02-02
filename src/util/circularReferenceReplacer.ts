export const circularReferenceReplacer = () => {
  const paths = new Map();
  const finalPaths = new Map();
  let root: any = null;

  return function (this: Object, field: string, value: any) {
    const p = paths.get(this) + '/' + field;
    const isComplex = value === Object(value);

    if (isComplex) paths.set(value, p);

    const existingPath = finalPaths.get(value) || '';
    const path = p.replace(/undefined\/\/?/, '');
    let val = existingPath ? { $ref: `#/${existingPath}` } : value;

    if (!root) {
      root = value;
    } else if (val === root) {
      val = { $ref: '#/' };
    }

    if (!existingPath && isComplex) finalPaths.set(value, path);

    return val;
  };
};
