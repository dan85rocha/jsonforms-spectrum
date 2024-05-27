import React, { useEffect, useState } from 'react';
import { CellProps } from '@jsonforms/core';
import merge from 'lodash/merge';
import { TextField, Flex, ContextualHelp, Heading, Content, Text } from '@adobe/react-spectrum';
import { DimensionValue } from '@react-types/shared';
import { SpectrumInputProps } from './index';
import SpectrumProvider from '../additional/SpectrumProvider';
import { useDebounce } from 'use-debounce';
import _ from "lodash";

export const InputText = React.memo(
  ({
    config,
    data,
    enabled,
    handleChange,
    id,
    isValid,
    errors,
    label,
    path,
    required,
    schema,
    uischema,
  }: CellProps & SpectrumInputProps) => {
    const appliedUiSchemaOptions = merge({}, config, uischema.options);

    const width: DimensionValue | undefined = appliedUiSchemaOptions.trim ? undefined : '100%';
    const [inputData, setInputData] = useState(data || '');
    const [debouncedInputData] = useDebounce(inputData, 500, {leading: false, trailing: true});

    const contextualHelp = appliedUiSchemaOptions?.contextualHelp ?? schema?.fieldDescription;

    useEffect(() => { // track updates coming from source
      if (data !== inputData) setInputData(data || '')
    }, [data])

    useEffect(() => {
      if (debouncedInputData !== data) {
        handleChange(path, debouncedInputData || '')
      }
    }, [debouncedInputData])

    return (
      <SpectrumProvider width={width}>
        <Flex direction='row' alignItems='stretch' flex='auto inherit'>
          <TextField
            aria-label={label ? label : 'textfield'}
            autoFocus={appliedUiSchemaOptions.focus}
            description={appliedUiSchemaOptions.description ?? false}
            errorMessage={errors}
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
            onChange={(value) => {
              setInputData(value || "") // set the data internally
            }}
            type={appliedUiSchemaOptions.format ?? 'text'}
            validationState={isValid ? 'valid' : 'invalid'}
            value={inputData}
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
