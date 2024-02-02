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
import React, { useContext } from 'react';
import { Flex, View, ActionButton } from '@adobe/react-spectrum';
import {
  CombinatorRendererProps,
  JsonFormsUISchemaRegistryEntry,
  JsonSchema,
  RendererProps,
} from '@jsonforms/core';
import { withJsonFormsOneOfProps } from '@jsonforms/react';
import { useDebouncedChange } from '../../util';
import Link from '@spectrum-icons/workflow/Link';
import Asset from '@spectrum-icons/workflow/Asset';
import FolderOpen from '@spectrum-icons/workflow/FolderOpen';
import { merge } from 'lodash';
import { InputText } from '../../spectrum-control/InputText';
import { RenderersConfigContext } from '../../context';
interface FragmentReferenceProps extends RendererProps {
  data?: any;
  enabled: boolean;
  label?: string | undefined;
  rootSchema: JsonSchema;
  uischemas: JsonFormsUISchemaRegistryEntry[];
  isValid: any;
  id: any;
  required: any;
  errors: any;
  visible: any;
}

export const SpectrumContentReferenceControl = React.memo(
  ({
    data,
    label,
    enabled,
    path,
    id,
    schema,
    uischema,
    rootSchema,
    config,
    handleChange,
    isValid,
    required,
    errors,
    visible,
  }: FragmentReferenceProps & CombinatorRendererProps & { schema: any }) => {
    // console.log('\x1b[31m ~ SpectrumContentReferenceControl:', data, '\n', path, '\n', schema, '\n', uischema, '\n', label);
    const appliedUiSchemaOptions = merge({}, config, uischema.options);

    const [inputText, onChange] = useDebouncedChange(
      handleChange,
      schema?.default ?? '',
      data,
      path
    );

    const idlePostMessage = uischema.options?.idlePostMessage;
    const assetPickerOptions = uischema.options?.assetPicker;
    const { externalizePath } = useContext(RenderersConfigContext);
    // const width: DimensionValue | undefined = appliedUiSchemaOptions.trim ? undefined : '100%';

    const previewMedia: boolean = appliedUiSchemaOptions?.previewMedia ?? false;
    const externalizeAsset: boolean = appliedUiSchemaOptions?.externalizeAsset ?? false;
    const previewMediaSuffix: string | boolean =
      typeof data === 'string' ? data?.substring(data?.lastIndexOf('.') + 1) : false;

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

    return (
      <View>
        <Flex direction='column' gap='size-100'>
          <Flex direction='row' alignItems='stretch' flex='auto inherit'>
            <InputText
              data={data}
              handleChange={handleChange}
              isValid={isValid !== undefined ? isValid : true}
              label={!uischema?.options?.noLabel ? label : undefined}
              path={path}
              required={required}
              schema={schema}
              uischema={uischema}
              rootSchema={rootSchema}
              enabled={enabled}
              id={id}
              errors={errors}
              visible={visible}
            />
            <ActionButton
              onPress={() => sendMessage()}
              aria-label={assetPickerOptions?.buttonText ?? `Asset Picker`}
              UNSAFE_className='assetPickerButton'
              UNSAFE_style={
                assetPickerOptions?.icon === false || assetPickerOptions?.buttonText === false
                  ? { marginTop: uischema?.options?.noLabel ? 0 : 25 }
                  : { paddingRight: 8, marginTop: uischema?.options?.noLabel ? 0 : 25 }
              }
            >
              {assetPickerOptions?.icon === false ? undefined : uischema.options?.assetPickerOptions
                  ?.icon === 'url' ? (
                <Link size='S' />
              ) : assetPickerOptions?.icon === 'asset' ? (
                <Asset size='S' />
              ) : (
                <FolderOpen size='S' />
              )}
              {assetPickerOptions?.buttonText}
            </ActionButton>
          </Flex>
          {previewMedia ? (
            previewMediaSuffix === 'mp4' ||
            previewMediaSuffix === 'ogg' ||
            previewMediaSuffix === 'webm' ? (
              <video
                controls
                src={externalizeAsset ? externalizePath(data) : data}
                width={200}
                style={{ marginTop: 10 }}
              >
                Sorry, but the Media "{data}" couldn't be displayed.
              </video>
            ) : (
              <img
                src={externalizeAsset ? externalizePath(data) : data}
                alt={`Preview of ${data}`}
                width={200}
                style={{ marginTop: 10 }}
                onError={(e) => {
                  e.currentTarget.src =
                    'https://jenkinselite.com/wp-content/uploads/2018/11/no_media.png';
                }}
              />
            )
          ) : null}
        </Flex>
      </View>
    );
  }
);

export default withJsonFormsOneOfProps(SpectrumContentReferenceControl as any);
