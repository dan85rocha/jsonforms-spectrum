import { RankedTester } from '@jsonforms/core';

import SpectrumFragmentReferenceControl from './SpectrumFragmentReferenceControl';

export default SpectrumFragmentReferenceControl;

export const SpectrumFragmentReferenceControlTester: RankedTester = (uischema, _, __) => {
  if (uischema.type === 'Control' && uischema.options?.fragmentReference) {
    return 10;
  } else {
    return -1;
  }
};
