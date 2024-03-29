/*
  The MIT License

  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms

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
  createCombinatorRenderInfos,
  findMatchingUISchema,
  isAllOfControl,
  RankedTester,
  rankWith,
  StatePropsOfCombinator,
} from '@jsonforms/core';
import { JsonFormsDispatch, withJsonFormsAllOfProps } from '@jsonforms/react';
import { View } from '@adobe/react-spectrum';
import SpectrumProvider from '../additional/SpectrumProvider';

const SpectrumAllOfRenderer = ({
  cells,
  enabled,
  path,
  renderers,
  rootSchema,
  schema,
  uischema,
  uischemas,
  visible,
}: StatePropsOfCombinator) => {
  const delegateUISchema = findMatchingUISchema(uischemas)(schema, uischema.scope, path);
  if (delegateUISchema) {
    return (
      <View isHidden={!visible}>
        <SpectrumProvider>
          <JsonFormsDispatch
            cells={cells}
            enabled={enabled}
            path={path}
            renderers={renderers}
            schema={schema}
            uischema={delegateUISchema}
          />
        </SpectrumProvider>
      </View>
    );
  }
  let allOfRenderInfos;
  if (schema?.allOf) {
    allOfRenderInfos = createCombinatorRenderInfos(
      schema.allOf,
      rootSchema,
      'allOf',
      uischema,
      path,
      uischemas
    );
  }

  return (
    <View isHidden={!visible}>
      {allOfRenderInfos?.map((allOfRenderInfo, allOfIndex) => (
        <JsonFormsDispatch
          key={allOfIndex}
          schema={allOfRenderInfo.schema}
          uischema={allOfRenderInfo.uischema}
          path={path}
          renderers={renderers}
          cells={cells}
        />
      ))}
    </View>
  );
};

export const SpectrumAllOfRendererTester: RankedTester = rankWith(4, isAllOfControl);
export default withJsonFormsAllOfProps(SpectrumAllOfRenderer);
