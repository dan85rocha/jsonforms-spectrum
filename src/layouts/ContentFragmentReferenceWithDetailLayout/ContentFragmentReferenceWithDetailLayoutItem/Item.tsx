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
import { View } from '@adobe/react-spectrum';
import SpectrumProvider from '../../../additional/SpectrumProvider';
import ModalItemHeader from './Header';
import { OwnPropsOfSpectrumArrayModalItem } from '../SpectrumContentFragmentReference';
import { HandleChangeProps, ModalItemAnimationWrapper, withHandleChange } from '../../../util';
import { Breadcrumbs, useBreadcrumbs } from '../../../context';

const Item = React.memo(
  ({
    childData,
    childLabel = '',
    data,
    elements,
    index,
    layout,
    path,
    removeItem,
    schema,
    uischema,
    handleChange,
  }: OwnPropsOfSpectrumArrayModalItem & HandleChangeProps) => {
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
            name: childLabel || layout?.label,
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
              index,
              path,
              crxPath: childData?._path,
              breadCrumbLabel: childLabel,
              addToQuery: true,
            },
            '*'
          );
        } else {
          window.postMessage(
            {
              type: 'expanded-item',
              index,
              path,
              breadCrumbLabel: childLabel,
              addToQuery: false,
            },
            '*'
          );
        }
      },
      [expanded, setExpanded, path, childLabel, addBreadcrumb, deleteBreadcrumb, breadcrumbs]
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
        schema: [schema],
        current: {
          path,
          index,
          data: childData,
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
      <ModalItemHeader
        data={data}
        expanded={expanded}
        index={index}
        path={path}
        handleExpand={toggleExpand}
        removeItem={removeItem}
        childLabel={childLabel}
        childData={childData}
        customPicker={{
          enabled: uischema?.options?.picker,
          handler: customPickerHandler,
        }}
        layout={layout}
        uischema={uischema}
      />
    );

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
            elements={elements[index]}
            expanded={expanded}
            handleExpand={toggleExpand}
            header={header}
            isAnimating={isAnimating}
            path={path}
            setIsAnimating={setIsAnimating}
          />
        </View>
      </SpectrumProvider>
    );
  }
);

export default withHandleChange(Item);
