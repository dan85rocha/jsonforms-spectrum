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
import { JsonFormsDispatch, JsonFormsStateContext, withJsonFormsContext } from '@jsonforms/react';
import { composePaths, findUISchema } from '@jsonforms/core';
import SpectrumProvider from '../../additional/SpectrumProvider';
import {
  ctxToSpectrumArrayItemProps,
  indexOfFittingSchemaObject,
  SpectrumItemHeader,
} from '../ArrayUtils';
import { checkIfUserIsOnMobileDevice, ModalItemAnimationWrapper } from '../../util';
import { Breadcrumbs, useBreadcrumbs } from '../../context';
import { OwnPropsOfSpectrumArrayItem } from '../ArrayUtils';

interface NonEmptyRowProps {
  DNDHandle?: any;
  moveDownCreator?: (path: string, position: number) => () => void;
  moveUpCreator?: (path: string, position: number) => () => void;
  rowIndex?: number | undefined;
}

const SpectrumArrayModalItem = React.memo(
  ({
    DNDHandle = false,
    callbackOpenedIndex,
    childData,
    childLabel,
    customLabel,
    duplicateItem,
    enabled,
    index,
    openIndex,
    path,
    removeItem,
    renderers,
    schema,
    uischema,
    uischemas = [],
  }: OwnPropsOfSpectrumArrayItem & NonEmptyRowProps) => {
    let foundUISchema = findUISchema(uischemas, schema, uischema.scope, path);

    // ContentFragmentReferenceWithDetail needs to be stripped
    // or we open a double panel (picker already provided by array).
    if (foundUISchema.type === 'ContentFragmentReferenceWithDetail') {
      foundUISchema = (foundUISchema as any).elements[0];
    }
    if (typeof uischema?.options?.detail === 'object') {
      foundUISchema = uischema.options.detail;
    }

    if (!childLabel || childLabel === '<p></p>') {
      childLabel = `Item ${index + 1}`;
    }

    const childPath = composePaths(path, `${index}`);
    /* If The Component has an empty Object, open it (true for a newly added Component) */
    const [expanded, setExpanded] = React.useState(openIndex === index ? true : false);
    const [isAnimating, setIsAnimating] = React.useState(false);
    const enableDetailedView = uischema?.options?.enableDetailedView ?? true;

    const userIsOnMobileDevice: boolean = checkIfUserIsOnMobileDevice(
      navigator.userAgent.toLowerCase()
    );

    const { breadcrumbs, addBreadcrumb, deleteBreadcrumb } = useBreadcrumbs();

    const toggleExpanded = React.useCallback(
      (desiredState?: boolean) => {
        if (desiredState === undefined) {
          desiredState = !expanded;
          if (enableDetailedView === false) {
            callbackOpenedIndex(index);
            setTimeout(() => {
              callbackOpenedIndex(undefined);
            }, 100);
          }
        }
        if (desiredState) {
          addBreadcrumb({
            path: childPath,
            name: customLabel || childLabel,
          });
        } else {
          deleteBreadcrumb(childPath);
        }
        if (desiredState === expanded) {
          return;
        }
        if (!userIsOnMobileDevice) {
          setIsAnimating(true);
        }
        setExpanded(desiredState);
        if (desiredState) {
          if (enableDetailedView === true) {
            window.postMessage(
              {
                type: 'expanded-item',
                index,
                path,
                crxPath: childData?._path,
                breadCrumbLabel: customLabel || childLabel,
                addToQuery: true,
              },
              '*'
            );
          }
          callbackOpenedIndex(index);
        } else {
          if (enableDetailedView === true) {
            window.postMessage(
              {
                type: 'expanded-item',
                index,
                path,
                breadCrumbLabel: customLabel || childLabel,
                addToQuery: false,
              },
              '*'
            );
            callbackOpenedIndex(undefined);
          } else {
            callbackOpenedIndex(index);
          }
        }
      },
      [
        expanded,
        setExpanded,
        customLabel,
        childLabel,
        enableDetailedView,
        breadcrumbs,
        deleteBreadcrumb,
        addBreadcrumb,
      ]
    );

    const breadcrumbsRef = React.useRef<Breadcrumbs | null>(null);

    React.useEffect(() => {
      if (breadcrumbs.hasPrefix(childPath)) {
        toggleExpanded(true);
      } else if (
        breadcrumbsRef.current &&
        breadcrumbsRef.current.hasPrefix(childPath) &&
        !breadcrumbs.hasPrefix(childPath)
      ) {
        toggleExpanded(false);
      }
      breadcrumbsRef.current = breadcrumbs;
    }, [breadcrumbs]);

    if (uischema.options?.oneOfModal) {
      indexOfFittingSchemaObject['oneOfModal'] = true;
    }
    if (uischema.options?.OneOfPicker) {
      indexOfFittingSchemaObject['OneOfPicker'] = true;
    }

    const customPickerHandler = () => {
      window.postMessage({
        type: 'customPicker:open',
        open: true,
        schema,
        current: {
          path,
          index,
          data: childData,
        },
      });
    };

    if (childPath.includes('multiContentReference')) {
    }
    const JsonFormsDispatchComponent = (
      <div className='array-item-content'>
        <JsonFormsDispatch
          enabled={enabled}
          key={childPath}
          path={childPath}
          renderers={renderers}
          schema={schema}
          uischema={foundUISchema || uischema}
          visible={false}
        />
      </div>
    );

    const header = (
      <SpectrumItemHeader
        DNDHandle={DNDHandle}
        JsonFormsDispatch={JsonFormsDispatchComponent}
        childData={childData}
        childLabel={customLabel || childLabel}
        customPicker={{ enabled: uischema?.options?.picker, handler: customPickerHandler }}
        duplicateItem={duplicateItem}
        enableDetailedView={enableDetailedView}
        expanded={expanded}
        handleExpand={toggleExpanded}
        index={index}
        path={path}
        removeItem={removeItem}
        uischema={uischema}
      />
    );

    return (
      <SpectrumProvider flex='auto' width='100%'>
        <View
          UNSAFE_className={`list-array-item ${
            enableDetailedView ? 'enableDetailedView' : 'accordionView'
          } ${expanded ? 'expanded' : 'collapsed'} ${
            uischema?.options?.noAccordion ? 'noAccordion' : null
          }`}
          borderColor='dark'
          borderRadius='medium'
          borderWidth='thin'
          padding='size-150'
        >
          {header}
          {expanded && !enableDetailedView && (
            <View UNSAFE_className='json-form-dispatch-wrapper'>{JsonFormsDispatchComponent}</View>
          )}
          {enableDetailedView && (
            <ModalItemAnimationWrapper
              enableDetailedView={enableDetailedView}
              expanded={expanded}
              handleExpand={toggleExpanded}
              isAnimating={isAnimating}
              path={path}
              setIsAnimating={setIsAnimating}
            >
              {expanded || isAnimating ? (
                <View UNSAFE_className='json-form-dispatch-wrapper'>
                  {enableDetailedView && header}
                  {JsonFormsDispatchComponent}
                </View>
              ) : null}
            </ModalItemAnimationWrapper>
          )}
        </View>
      </SpectrumProvider>
    );
  }
);

const withContextToSpectrumArrayItemProps =
  (
    Component: React.ComponentType<OwnPropsOfSpectrumArrayItem>
  ): React.ComponentType<OwnPropsOfSpectrumArrayItem> =>
  ({ ctx, props, DNDHandle }: JsonFormsStateContext & OwnPropsOfSpectrumArrayItem) => {
    const stateProps = ctxToSpectrumArrayItemProps(ctx, props);
    return <Component {...stateProps} {...DNDHandle} />;
  };

export const withJsonFormsSpectrumArrayItemProps = (
  Component: React.ComponentType<OwnPropsOfSpectrumArrayItem>
): React.ComponentType<any> =>
  withJsonFormsContext(withContextToSpectrumArrayItemProps(React.memo(Component)));

export default withJsonFormsSpectrumArrayItemProps(SpectrumArrayModalItem);
