/*
  The MIT License
  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms
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
import {
  and,
  Categorization,
  Category,
  isVisible,
  RankedTester,
  rankWith,
  StatePropsOfLayout,
  Tester,
  UISchemaElement,
  uiTypeIs,
} from '@jsonforms/core';
import { withJsonFormsLayoutProps } from '@jsonforms/react';
import { Content, Item, TabList, TabPanels, Tabs, View } from '@adobe/react-spectrum';
import { AjvProps, withAjvProps } from '../util';
import { SpectrumVerticalLayout } from '../layouts';
import SpectrumProvider from '../additional/SpectrumProvider';
import { useBreadcrumbs } from '../context/BreadcrumbContext';

export const isSingleLevelCategorization: Tester = and(
  uiTypeIs('Categorization'),
  (uischema: UISchemaElement): boolean => {
    const categorization = uischema as Categorization;

    return (
      categorization.elements &&
      categorization.elements.length > 0 &&
      categorization.elements.reduce((acc, e) => acc && e.type === 'Category', true)
    );
  }
);

export const SpectrumCategorizationRendererTester: RankedTester = rankWith(
  1,
  isSingleLevelCategorization
);

export interface SpectrumCategorizationRendererProps extends StatePropsOfLayout, AjvProps {}

// This recursive function tries to translate all encountered scopes in the uischema to paths
// For example this UISchema:
// {
//     "type": "Category",
//     "elements": [
//         {
//             "type": "Control",
//             "scope": "#/properties/planType"
//         },
//         {
//             "type": "HorizontalLayout",
//             "elements": [
//                 {
//                     "type": "Control",
//                     "scope": "#/properties/monthlyPrice",
//                 },
//                 {
//                     "type": "Control",
//                     "scope": "#/properties/monthlyPriceInfo"
//                 }
//             ]
//         },
//         {
//             "type": "HorizontalLayout",
//             "elements": [
//                 {
//                     "type": "Control",
//                     "scope": "#/properties/annualPrice",
//                 },
//                 {
//                     "type": "Control",
//                     "scope": "#/properties/annualPriceInfo"
//                 }
//             ]
//         },
//         {
//             "type": "Control",
//             "scope": "#/properties/planOptions",
//         },
//         {
//             "type": "Control",
//             "scope": "#/properties/button",
//         }
//     ]
// }
// Should be transformed into:
// [".planType", ".monthlyPrice", ".monthlyPriceInfo", ".annualPrice", ".annualPriceInfo", ".planOptions", ".button"]
const extractScopesAsPaths = (node: any) => {
  if (node?.elements) {
    return node.elements.flatMap(extractScopesAsPaths);
  } else if (node?.scope) {
    return [node.scope.replaceAll(/#?\/properties\//g, '.').replaceAll(/\//g, '.')];
  }
};

export const SpectrumCategorizationRenderer = (props: SpectrumCategorizationRendererProps) => {
  const { data, path, schema, uischema, visible, enabled, ajv } = props;

  const categorization = uischema as Categorization;
  const categories = categorization.elements.filter(
    (category: Categorization | Category, _index: number) => isVisible(category, data, '', ajv)
  );

  const { breadcrumbs } = useBreadcrumbs();

  // Given a path of this component "data.components.1.planItems.1"
  // and breadcrumbs
  // * data.components.1
  // * data.components.1.planItems.1
  // * data.components.1.planItems.1.button
  // this should return .button
  const shortestOutstandingBreadcrumb = breadcrumbs.hasPrefix(path)
    ? breadcrumbs
        .keys()
        .filter((breadcrumbPath) => breadcrumbPath.startsWith(path))
        .map((breadcrumbPath) => breadcrumbPath.slice(path.length))
        .filter((breadcrumbPath) => breadcrumbPath[0] === '.')
        .sort((x, y) => x.length - y.length)?.[0]
    : undefined;

  //We check if any category contains an outstanding breadcrumb
  const defaultOpenTab = (
    shortestOutstandingBreadcrumb
      ? categories.findIndex((category) =>
          extractScopesAsPaths(category).find(
            (scopeAsPath: any) => scopeAsPath === shortestOutstandingBreadcrumb
          )
        ) || 0
      : 0
  ).toString();

  return (
    <View isHidden={!visible}>
      <SpectrumProvider>
        <Tabs
          aria-label='Categorization' /* isDisabled={enabled === undefined ? false : !enabled} */
          defaultSelectedKey={defaultOpenTab}
        >
          <TabList>
            {categories?.map((category: { [key: string]: any }, index) => {
              return (
                <Item key={index}>
                  {category?.label ?? category?.i18n ?? `Category ${index + 1}`}
                </Item>
              );
            })}
          </TabList>
          <TabPanels>
            {categories?.map((category: { [key: string]: any }, index) => (
              <Item
                key={index}
                title={category?.label ?? category?.i18n ?? `Category ${index + 1}`}
              >
                <Content margin='size-160'>
                  <SpectrumVerticalLayout
                    uischema={
                      {
                        type: 'VerticalLayout',
                        elements: category.elements ?? [],
                      } as UISchemaElement
                    }
                    schema={schema}
                    path={path}
                    direction='column'
                    enabled={enabled === undefined ? true : enabled}
                    visible={visible === undefined ? true : visible}
                  ></SpectrumVerticalLayout>
                </Content>
              </Item>
            ))}
          </TabPanels>
        </Tabs>
      </SpectrumProvider>
    </View>
  );
};

export default withJsonFormsLayoutProps(withAjvProps(SpectrumCategorizationRenderer));
