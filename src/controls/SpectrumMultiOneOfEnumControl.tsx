/*
  The MIT License

  Copyright (c) 2020 headwire.com, Inc
  https://github.com/headwirecom/jsonforms-react-spectrum-renderers

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/

import {
  and,
  ControlProps,
  JsonSchema7,
  or,
  RankedTester,
  rankWith,
  schemaMatches,
  schemaTypeIs,
  uiTypeIs,
} from '@jsonforms/core';
import { withJsonFormsMultiEnumProps } from '@jsonforms/react';
import merge from 'lodash/merge';
import { SpectrumInputControl } from './SpectrumInputControl';
import { InputEnum } from '../spectrum-control/InputEnum';
import { InputEnumAutocomplete } from '../spectrum-control/InputEnumAutocomplete';
import { isArray } from 'lodash';

export const SpectrumMultiOneOfEnumControl = (props: ControlProps) => {
  const { config, uischema } = props;
  const appliedUiSchemaOptions = merge({}, config, uischema.options);

  return (
    <SpectrumInputControl
      {...props}
      input={appliedUiSchemaOptions.autocomplete === false ? InputEnum : InputEnumAutocomplete}
    />
  );
};

const isMultiOneOfEnumControl = and(
  uiTypeIs('Control'),
  schemaTypeIs('array'),
  schemaMatches((schema) =>
    ((schema?.items as JsonSchema7)?.oneOf as JsonSchema7[])?.every((s) => s.const !== undefined)
  )
);

const isMultiEnumControl = and(
  uiTypeIs('Control'),
  schemaTypeIs('array'),
  schemaMatches((schema) => {
    return (
      (schema?.items as JsonSchema7)?.type === 'string' &&
      isArray((schema?.items as JsonSchema7)?.enum)
    );
  })
);

export const SpectrumMultiOneOfEnumControlTester: RankedTester = rankWith(
  5,
  or(isMultiOneOfEnumControl, isMultiEnumControl)
);

export default withJsonFormsMultiEnumProps(SpectrumMultiOneOfEnumControl);
