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
import { RendererProps, ControlElement, Helpers, Layout } from '@jsonforms/core';
import { withJsonFormsLayoutProps } from '@jsonforms/react';
import { SpectrumMediaPreview } from './SpectrumMediaPreview';
import { renderChildren } from '../util';

const MediaPreviewLayoutRenderer = React.memo(
  ({ data, enabled, path, schema, uischema, visible }: RendererProps) => {
    const controlElement = uischema as ControlElement;
    const labelDescription = Helpers.createLabelDescriptionFrom(controlElement, schema);
    const label = labelDescription.show ? labelDescription.text : undefined;

    const layout = uischema as Layout;
    const elements = renderChildren(layout, schema, {}, path, enabled);

    return visible ? (
      <SpectrumMediaPreview
        data={data}
        enabled={enabled}
        label={label ?? ''}
        layout={layout}
        path={path}
        schema={schema}
        uischema={uischema}
        visible={visible}
        elements={elements}
      />
    ) : null;
  }
);

export default withJsonFormsLayoutProps(MediaPreviewLayoutRenderer);
