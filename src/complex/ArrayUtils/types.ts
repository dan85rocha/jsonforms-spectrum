import {
  composePaths,
  ControlElement,
  getData,
  JsonFormsRendererRegistryEntry,
  JsonFormsState,
  JsonSchema,
  Resolve,
  UISchemaElement,
  UISchemaTester,
} from '@jsonforms/core';
import { JsonFormsStateContext } from '@jsonforms/react';
import { findValue } from '../../util';

export interface OwnPropsOfSpectrumArrayItem {
  DNDHandle?: any;
  callbackOpenedIndex?: any;
  childData?: any;
  childLabel: string;
  duplicateItem(index: number): () => void;
  enabled: boolean;
  index: number;
  moveDownCreator?: ((path: string, position: number) => () => void) | undefined;
  moveUpCreator?: ((path: string, position: number) => () => void) | undefined;
  openIndex: number;
  path: string;
  removeItem(path: string, value: number): () => void;
  renderers?: JsonFormsRendererRegistryEntry[];
  rowIndex?: number;
  schema: JsonSchema;
  uischema: ControlElement;
  uischemas?: { tester: UISchemaTester; uischema: UISchemaElement }[];
  customLabel?: string;
}

/**
 * Map state to control props.No indexOfFittingSchema found
 * @param state the store's state
 * @param ownProps any own props
 * @returns {StatePropsOfControl} state props for a control
 */
export const mapStateToSpectrumArrayItemProps = (
  state: JsonFormsState,
  ownProps: OwnPropsOfSpectrumArrayItem
): OwnPropsOfSpectrumArrayItem => {
  const { schema, path, index, uischema } = ownProps;
  const childPath = composePaths(path, `${index}`);
  const childData = Resolve.data(getData(state), childPath);

  // If not given explicitly in the UISchema,
  // we try find the first property that has type like "string" or ["string, "null"]
  // to get an automatic meaningful label for array items.
  const labelProp =
    uischema.options?.elementLabelProp ||
    uischema.options?.childDataAsLabel ||
    (schema?.properties &&
      Object.entries(schema.properties).find(([propName, prop]) => {
        return (
          !['_model', '_model_path', '_path', '_variations', '_metadata'].includes(propName) &&
          ['string', 'number', 'integer'].some((type) => {
            return (
              prop.type === type ||
              (Array.isArray(prop.type) &&
                prop.type.includes(type) &&
                prop.type.includes('null') &&
                prop.type.length === 2)
            );
          })
        );
      })?.[0]);
  const childLabel =
    (labelProp && childData[labelProp]) ||
    (typeof uischema.options?.dataAsLabel === 'number'
      ? Object.values(childData)[uischema.options?.dataAsLabel]
      : findValue(childData, uischema.options?.dataAsLabel) ?? `Item ${index + 1}`);

  return {
    ...ownProps,
    childLabel,
    childData,
  };
};

export const ctxToSpectrumArrayItemProps = (
  ctx: JsonFormsStateContext,
  ownProps: OwnPropsOfSpectrumArrayItem
) => mapStateToSpectrumArrayItemProps({ jsonforms: { ...ctx } }, ownProps);
