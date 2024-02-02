/*
  The MIT License
  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms
  Copyright (c) 2023 headwire.com, Inc
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
import { View } from '@adobe/react-spectrum';
import SpectrumProvider from '../../additional/SpectrumProvider';
import FragmentReferenceHeader from './FragmentReferenceHeader';
import { HandleChangeProps, ModalItemAnimationWrapper, withHandleChange } from '../../util';
import { Breadcrumbs, useBreadcrumbs } from '../../context';
import { JsonFormsRendererRegistryEntry, JsonSchema, UISchemaElement } from '@jsonforms/core';
import { JsonFormsDispatch, useJsonForms } from '@jsonforms/react';

interface FragmentReferenceProps {
  data?: any;
  enabled: boolean;
  label?: string | undefined;
  path: string;
  renderers?: JsonFormsRendererRegistryEntry[] | undefined;
  schema: JsonSchema;
  uischema: UISchemaElement;
  visible: boolean;
  allowedSchemas: JsonSchema[];
}

const FragmentReference = React.memo(
  ({
    data,
    path,
    label,
    schema,
    uischema,
    allowedSchemas,
    handleChange,
    enabled,
  }: FragmentReferenceProps & HandleChangeProps) => {
    label =
      label ||
      data?._metadata?.stringMetadata.find((item: any) => item.name === 'title').value ||
      data?._model?.title ||
      (uischema as any)?.label ||
      'No Title found';
    const [expanded, setExpanded] = React.useState(false);
    const [isAnimating, setIsAnimating] = React.useState(false);
    const { breadcrumbs, addBreadcrumb, deleteBreadcrumb } = useBreadcrumbs();

    const toggleExpand = React.useCallback(
      (desiredState?: boolean) => {
        if (desiredState === undefined) {
          desiredState = !expanded;
        }
        if (desiredState) {
          addBreadcrumb({
            path: path,
            name: label,
          });
        } else {
          deleteBreadcrumb(path);
        }
        if (desiredState === expanded) {
          return;
        }
        setIsAnimating(true);
        setExpanded(desiredState);
        if (desiredState) {
          window.postMessage(
            {
              type: 'expanded-item',
              index: 0,
              path,
              crxPath: data?._path,
              breadCrumbLabel: label,
              addToQuery: true,
            },
            '*'
          );
        } else {
          window.postMessage(
            {
              type: 'expanded-item',
              index: 0,
              path,
              breadCrumbLabel: label,
              addToQuery: false,
            },
            '*'
          );
        }
      },
      [expanded, setExpanded, path, label, addBreadcrumb, deleteBreadcrumb, breadcrumbs]
    );

    const breadcrumbsRef = React.useRef<Breadcrumbs | null>(null);

    React.useEffect(() => {
      if (breadcrumbs.hasPrefix(path)) {
        toggleExpand(true);
      } else if (
        breadcrumbsRef.current &&
        breadcrumbsRef.current.hasPrefix(path) &&
        !breadcrumbs.hasPrefix(path)
      ) {
        toggleExpand(false);
      }
      breadcrumbsRef.current = breadcrumbs;
    }, [breadcrumbs]);

    const customPickerHandler = () => {
      window.postMessage({
        type: 'customPicker:open',
        open: true,
        schema: allowedSchemas,
        current: {
          path,
          index: 0,
          data,
        },
      });
    };

    const handleCustomPickerMessage = (e: MessageEvent) => {
      if (e?.data?.type === 'customPicker:return' && e?.data?.path === path && e?.data?.data) {
        handleChange(path, e.data.data);
      }
    };

    React.useEffect(() => {
      if (uischema?.options?.picker) {
        window.addEventListener('message', handleCustomPickerMessage);
      }

      return () => {
        if (uischema?.options?.picker) {
          window.removeEventListener('message', handleCustomPickerMessage);
        }
      };
    }, [data]);

    const header = (
      <FragmentReferenceHeader
        data={data}
        expanded={expanded}
        path={path}
        handleExpand={toggleExpand}
        removeItem={() => handleChange(path, null)}
        label={label}
        customPicker={{
          enabled: uischema?.options?.picker,
          handler: customPickerHandler,
        }}
        uischema={uischema}
      />
    );

    const { renderers, cells } = useJsonForms();

    return (
      <SpectrumProvider flex='auto' width='100%'>
        <View
          UNSAFE_className={`list-array-item enableDetailedView ${
            expanded ? 'expanded' : 'collapsed'
          } ${uischema?.options?.noAccordion ? 'noAccordion' : null}`}
          borderWidth='thin'
          borderColor='dark'
          borderRadius='medium'
          padding='size-150'
        >
          {header}
          <ModalItemAnimationWrapper
            expanded={expanded}
            handleExpand={toggleExpand}
            header={header}
            isAnimating={isAnimating}
            path={path}
            setIsAnimating={setIsAnimating}
            elements={
              <JsonFormsDispatch
                renderers={renderers}
                cells={cells}
                uischema={uischema}
                schema={schema}
                path={path}
                enabled={enabled}
              />
            }
          />
        </View>
      </SpectrumProvider>
    );
  }
);

export default withHandleChange(FragmentReference);
