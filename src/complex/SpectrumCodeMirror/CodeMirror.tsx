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
import React, { useEffect } from 'react';
import { CellProps } from '@jsonforms/core';
import merge from 'lodash/merge';
import { DimensionValue } from '@react-types/shared';
import { SpectrumInputProps } from '../../spectrum-control/index';
import SpectrumProvider from '../../additional/SpectrumProvider';
import { Button, View, useProvider } from '@adobe/react-spectrum';
import { circularReferenceReplacer } from '../../util';
import CodeMirror from '@uiw/react-codemirror';
import { json, jsonParseLinter } from '@codemirror/lang-json';
import { linter, lintGutter } from '@codemirror/lint';
import { debounce, last } from 'lodash';

export const InputCodeMirror = React.memo(
  ({
    config,
    data,
    enabled,
    handleChange,
    label,
    path,
    schema,
    uischema,
    visible,
  }: CellProps & SpectrumInputProps) => {
    let { colorScheme } = useProvider();
    const appliedUiSchemaOptions = merge({}, config, uischema.options);
    const width: DimensionValue | undefined = appliedUiSchemaOptions.trim ? undefined : '100%';
    const showSaveButton: boolean = appliedUiSchemaOptions.showSaveButton ?? false;
    const readOnly: boolean = appliedUiSchemaOptions.readOnly ?? schema.readOnly ?? false;
    const hideFormatButton: boolean = appliedUiSchemaOptions.hideFormatButton ?? false;
    const [value, setValue] = React.useState(data);
    const [initialValue, setInitialValue] = React.useState(data);
    const [cachedValue, setCachedValue] = React.useState(data);
    const [lastSelection, setLastSelection] = React.useState();
    const cm = React.useRef();
    const err = getErr(value);
    const cachedErr = getErr(cachedValue);
    /* const save = React.useCallback(() => {
      if (typeof cachedValue === 'string') {
        handleChange(path, JSON.parse(cachedValue));
        setValue(JSON.parse(cachedValue));
      } else {
        handleChange(path, JSON.parse(JSON.stringify(cachedValue, circularReferenceReplacer())));
        setValue(JSON.parse(JSON.stringify(cachedValue, circularReferenceReplacer())));
      }
    }, [cachedValue]); */
    const saveAndFormat = () => {
      if (typeof cachedValue === 'string') {
        handleChange(path, JSON.parse(cachedValue));
        setValue(JSON.parse(cachedValue));
      } else {
        handleChange(path, JSON.parse(JSON.stringify(cachedValue, circularReferenceReplacer())));
        setValue(JSON.parse(JSON.stringify(cachedValue, circularReferenceReplacer())));
      }
      setInitialValue(JSON.parse(JSON.stringify(JSON.parse(value), circularReferenceReplacer())));
    };

    const onChangeHandler = React.useCallback(
      (newValue: any, _viewUpdate: any) => {
        // console.log("VIEW UPDATE", _viewUpdate, _viewUpdate.state.selection)
        setLastSelection(_viewUpdate.state.selection)
        setCachedValue(newValue);
        setValue(newValue);
        if (!getErr(newValue) && !cachedErr && !showSaveButton) {
          handleChange(path, JSON.parse(newValue));
        }
      },
      [cachedValue]
    );

    function getErr(value: string) {
      if (!value) {
        return null;
      }
      try {
        if (typeof value === 'string') {
          JSON.parse(value);
        } else {
          JSON.parse(JSON.stringify(value, circularReferenceReplacer()));
        }
        return null;
      } catch (err) {
        return String(err);
      }
    }

    useEffect(() => {
      setValue(data);
      // console.log("LAST SELECTION", lastSelection)
      if (lastSelection && cm.current?.view) {
        // console.log("APPLY LAST SELECTION", cm.current?.view, lastSelection);
        try {
          cm.current?.view.dispatch({
            selection: lastSelection
          })
        } catch (error) {
          // console.warn(error);
        }
      }
    }, [data])

    return (
      <SpectrumProvider width={width} isHidden={!visible}>
        {label && (
          <label
            className='SpectrumLabel'
            style={{ display: 'flex', paddingTop: 4, paddingBottom: 5 }}
          >
            {label}
          </label>
        )}
        <CodeMirror
          ref={cm}
          value={JSON.stringify(data, null, 2) || ''}
          onChange={debounce(onChangeHandler, 500)}
          extensions={
            err || cachedErr ? [json(), linter(jsonParseLinter()), lintGutter()] : [json()]
          }
          className={`SpectrumCodeMirror ${enabled ? '' : 'readOnly'}`}
          theme={colorScheme === 'dark' ? 'dark' : 'light'}
          editable={!readOnly && enabled}
        
        />
        {!hideFormatButton && !readOnly && enabled && (
          <View paddingTop='size-50'>
            <Button
              variant='cta'
              onPress={saveAndFormat}
              isDisabled={
                !!err || !!cachedErr || JSON.stringify(value) === JSON.stringify(initialValue)
              }
            >
              {showSaveButton ? 'Save' : 'Format'}
            </Button>
          </View>
        )}
      </SpectrumProvider>
    );
  }
);
