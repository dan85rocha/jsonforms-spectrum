/*
  The MIT License

  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms

  Copyright (c) 2022 headwire.com, Inc
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
import React from 'react';
import { Flex, Heading, View } from '@adobe/react-spectrum';
import {
  CombinatorRendererProps,
  createCombinatorRenderInfos,
  findUISchema,
  JsonFormsUISchemaRegistryEntry,
  JsonSchema,
  //OwnPropsOfControl,
  RendererProps,
} from '@jsonforms/core';
import { /*withJsonFormsControlProps,*/ withJsonFormsOneOfProps } from '@jsonforms/react';
import FragmentReference from './FragmentReference';
interface FragmentReferenceProps extends RendererProps {
  data?: any;
  enabled: boolean;
  label?: string | undefined;
  rootSchema: JsonSchema;
  uischemas: JsonFormsUISchemaRegistryEntry[];
}

export const SpectrumFragmentReferenceControl = React.memo(
  ({
    data,
    enabled,
    label,
    path,
    renderers,
    schema,
    uischema,
    visible,
    uischemas,
    rootSchema,
  }: FragmentReferenceProps & CombinatorRendererProps) => {
    // This control can be rendered either with a oneOf (multiple possible models),
    // or a single possible model. We need to resolve schmeas in the oneOf case,
    // but the schema is already resolved if there is only one possibility.
    const oneOfRenderInfos = schema.oneOf
      ? createCombinatorRenderInfos(schema.oneOf, rootSchema, 'oneOf', uischema, path, uischemas)
      : [
          {
            schema,
            uischema: findUISchema(uischemas, schema, uischema.scope, path, undefined, uischema),
            label,
          },
        ];
    let indexFromDiscriminator: number = 0;
    const discriminatingProperty: string = (schema as any).discriminator?.propertyName;
    if (discriminatingProperty) {
      const discriminatorValues = oneOfRenderInfos?.map(
        (info) => info.schema.properties?.[discriminatingProperty]?.const
      );
      indexFromDiscriminator = discriminatorValues?.indexOf(data?.[discriminatingProperty]);
    }

    const info = oneOfRenderInfos[indexFromDiscriminator > 0 ? indexFromDiscriminator : 0];

    return (
      <View>
        <Flex direction='row' justifyContent='space-between'>
          <Heading level={4}>{label}</Heading>
        </Flex>
        <Flex direction='column' gap='size-100'>
          <Flex direction='row' alignItems='stretch' flex='auto inherit'>
            <FragmentReference
              data={data}
              enabled={enabled}
              path={path}
              renderers={renderers}
              schema={info.schema}
              allowedSchemas={oneOfRenderInfos.map((info) => info.schema)}
              uischema={info.uischema}
              visible={visible}
            />
          </Flex>
        </Flex>
      </View>
    );
  }
);

export default withJsonFormsOneOfProps(SpectrumFragmentReferenceControl);
