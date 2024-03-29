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
import { CellProps } from '@jsonforms/core';
import merge from 'lodash/merge';
import { TextField, Flex, ContextualHelp, Heading, Content, Text } from '@adobe/react-spectrum';
import { DimensionValue } from '@react-types/shared';
import { SpectrumInputProps } from './index';
import SpectrumProvider from '../additional/SpectrumProvider';
import { useDebouncedChange } from '../util';

export const InputText = React.memo(
  ({
    config,
    data,
    enabled,
    handleChange,
    id,
    isValid,
    label,
    path,
    required,
    schema,
    uischema,
  }: CellProps & SpectrumInputProps) => {
    const appliedUiSchemaOptions = merge({}, config, uischema.options);

    const width: DimensionValue | undefined = appliedUiSchemaOptions.trim ? undefined : '100%';

    const [inputText, onChange] = useDebouncedChange(
      handleChange,
      schema?.default ?? '',
      data,
      path
    );

    const isValidCheck = React.useMemo(() => {
      let minLength = appliedUiSchemaOptions.minLength ?? (required ? 1 : 0);
      let maxLength = appliedUiSchemaOptions.maxLength ?? Infinity;
      if (isValid && !inputText && minLength === 0) {
        return true;
      } else if (!inputText) {
        return false;
      } else if (isValid && inputText.length >= minLength && inputText.length <= maxLength) {
        return true;
      } else {
        return false;
      }
    }, [inputText, appliedUiSchemaOptions, isValid, required]);

    const errorMessage = () => {
      let minLength = appliedUiSchemaOptions.minLength ?? (required ? 1 : false);
      let maxLength = appliedUiSchemaOptions.maxLength;
      if (minLength && maxLength) {
        return `Must be between ${minLength} and ${maxLength} characters`;
      } else if (minLength) {
        return `Must be at least ${minLength} characters`;
      } else if (maxLength) {
        return `Must be at most ${maxLength} characters`;
      }
    };

    const idlePostMessage = uischema.options?.idlePostMessage;

    const sendMessage = () => {
      const message: object = {
        type: 'assetPickerOpen',
        jsonFormsPath: path,
        /* rootPath: 'x_rootPath',
        selectedPath: '_path', */
      };
      const targetOrigin: string = '*';
      window.postMessage(message, targetOrigin);
    };

    window.addEventListener('message', (e) => {
      if (e?.data?.type && e?.data?.type === 'assetPickerClose') {
        if (e.data.jsonFormsPath !== path) return;
        onChange(e.data.selectedPath);
      }
    });

    const firstRender = React.useRef(true);
    if (idlePostMessage) {
      React.useEffect(() => {
        if (firstRender.current) {
          firstRender.current = false;
          return;
        }
        const delayDebounceFn = setTimeout(() => {
          sendMessage();
        }, 3000);

        return () => clearTimeout(delayDebounceFn);
      }, [inputText]);
    }

    React.useEffect(() => {
      onChange(data);
    }, [data]);

    const contextualHelp = appliedUiSchemaOptions?.contextualHelp ?? schema?.fieldDescription;

    return (
      <SpectrumProvider width={width}>
        <Flex direction='row' alignItems='stretch' flex='auto inherit'>
          <TextField
            aria-label={label ? label : 'textfield'}
            autoFocus={appliedUiSchemaOptions.focus}
            description={appliedUiSchemaOptions.description ?? false}
            errorMessage={appliedUiSchemaOptions.errorMessage ?? errorMessage()}
            id={id && `${id}-input`}
            inputMode={appliedUiSchemaOptions.inputMode ?? 'none'}
            isDisabled={enabled === undefined ? false : !enabled}
            isQuiet={appliedUiSchemaOptions.isQuiet ?? false}
            isReadOnly={appliedUiSchemaOptions.readonly ?? schema.readOnly ?? false}
            isRequired={required}
            label={label}
            labelAlign={appliedUiSchemaOptions.labelAlign ?? 'start'}
            labelPosition={appliedUiSchemaOptions.labelPosition ?? 'top'}
            maxLength={appliedUiSchemaOptions.maxLength ?? undefined}
            minLength={appliedUiSchemaOptions.minLength ?? undefined}
            minWidth={appliedUiSchemaOptions.minWidth ?? 'size-2000'}
            necessityIndicator={appliedUiSchemaOptions.necessityIndicator ?? false}
            onChange={onChange}
            type={appliedUiSchemaOptions.format ?? 'text'}
            validationState={isValidCheck ? 'valid' : 'invalid'}
            value={inputText}
            width={width}
          />
          {contextualHelp ? (
            <ContextualHelp variant={contextualHelp?.variant === 'help' ? 'help' : 'info'}>
              {contextualHelp?.title && <Heading>{contextualHelp?.title}</Heading>}
              <Content>
                <Text>{schema?.fieldDescription ?? contextualHelp?.content}</Text>
              </Content>
            </ContextualHelp>
          ) : null}
        </Flex>
      </SpectrumProvider>
    );
  }
);
