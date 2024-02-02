import { RankedTester } from '@jsonforms/core';

import SpectrumContentReferenceControl from './SpectrumContentReferenceControl';

export default SpectrumContentReferenceControl;

export const SpectrumContentReferenceControlTester: RankedTester = (uischema, _, __) => {
  if (uischema.type === 'Control' && uischema.options?.contentReference) {
    return 10;
  } else {
    return -1;
  }
};
