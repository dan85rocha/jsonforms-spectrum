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
import React from 'react';
import { EnumCellProps } from '@jsonforms/core';
import merge from 'lodash/merge';
import { SpectrumInputProps } from './index';
import { DimensionValue } from '@react-types/shared';
import { Content, Item, ContextualHelp, Heading, Text, Picker } from '@adobe/react-spectrum';
import SpectrumProvider from '../additional/SpectrumProvider';
import { TagGroup } from '@react-spectrum/tag';

export const InputEnum = React.memo(
  ({
    config,
    data,
    enabled,
    handleChange,
    id,
    label,
    options,
    path,
    required,
    schema,
    uischema,
  }: EnumCellProps & SpectrumInputProps) => {
    const appliedUiSchemaOptions = merge({}, config, uischema.options);
    const width: DimensionValue | undefined = appliedUiSchemaOptions.trim ? undefined : '100%';

    let [value, setValue] = React.useState(data ?? '');
    const isArray = schema?.type === 'array';
    const handleOnChange = (value: any) => {
      setValue(value);
      if (isArray) {
        if (!(data?.indexOf(value) >= 0)) {
          if (data) {
            handleChange(path, [...data, value]);
          } else {
            handleChange(path, [value]);
          }
        }
        setTimeout(() => {
          setValue(null);
        }, 100);
      } else {
        handleChange(path, value);
      }
    };

    React.useEffect(() => {
      if (!data && schema?.default) {
        handleOnChange(schema.default);
      }
    }, [schema?.default]);

    label = label || 'Enum';

    const contextualHelp = appliedUiSchemaOptions?.contextualHelp ?? schema?.fieldDescription;

    const deleteTag = (value: React.Key) => {
      handleChange(
        path,
        (data as string[]).filter((item) => item !== value)
      );
    };

    const findEnumSchema = (schemas: any) => {
      if (schemas !== undefined) {
        return schemas?.find(
          (s: any) => s.enum !== undefined && (s.type === 'string' || s.type === undefined)
        );
      }
    };
    const tryEnumSchema = (anyOf: any) => {
      const enumSchema: any = findEnumSchema(anyOf);
      return enumSchema?.enum?.map((v: any) => {
        return { value: v, label: v };
      });
    };
    const items = options ?? tryEnumSchema(schema?.anyOf);

    return (
      <SpectrumProvider width={width}>
        <Picker
          align={appliedUiSchemaOptions.align ?? 'start'}
          aria-label={label ?? 'picker'}
          autoFocus={appliedUiSchemaOptions.focus}
          defaultOpen={appliedUiSchemaOptions.defaultOpen ?? false}
          description={appliedUiSchemaOptions.description ?? false}
          direction={appliedUiSchemaOptions.direction ?? 'bottom'}
          errorMessage={appliedUiSchemaOptions.errorMessage ?? false}
          id={id}
          isDisabled={enabled === undefined ? false : !enabled}
          isQuiet={appliedUiSchemaOptions.isQuiet ?? false}
          isRequired={required}
          items={items}
          key={id}
          label={label}
          labelAlign={appliedUiSchemaOptions.labelAlign ?? 'start'}
          labelPosition={appliedUiSchemaOptions.labelPosition ?? 'top'}
          menuWidth={appliedUiSchemaOptions.menuWidth ?? false}
          minWidth={appliedUiSchemaOptions.minWidth ?? 'size-2000'}
          necessityIndicator={appliedUiSchemaOptions.necessityIndicator ?? false}
          onSelectionChange={handleOnChange}
          placeholder={appliedUiSchemaOptions.placeholder}
          selectedKey={value}
          shouldFlip={appliedUiSchemaOptions.shouldFlip ?? true}
          width={width}
        >
          {(item: any) => <Item key={item.value}>{item.label}</Item>}
        </Picker>
        {contextualHelp ? (
          <ContextualHelp variant={contextualHelp?.variant === 'help' ? 'help' : 'info'}>
            {contextualHelp?.title && <Heading>{contextualHelp?.title}</Heading>}
            <Content>
              <Text>{schema?.fieldDescription ?? contextualHelp?.content}</Text>
            </Content>
          </ContextualHelp>
        ) : null}
        {isArray && (
          <TagGroup
            items={data}
            allowsRemoving
            onRemove={(key: React.Key) => deleteTag(key)}
            aria-label='TagGroup'
          >
            {data?.map((item: string) => {
              const option = items?.find((option: any) => option.value === item);
              return <Item key={option?.value}>{option?.label}</Item>;
            })}
          </TagGroup>
        )}
      </SpectrumProvider>
    );
  }
);
