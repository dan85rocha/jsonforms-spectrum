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
import { ControlProps, isDescriptionHidden } from '@jsonforms/core';
import merge from 'lodash/merge';
import { Flex, Text, View, TooltipTrigger, Tooltip, ActionButton, ContextualHelp, Heading, Content } from '@adobe/react-spectrum';
import Info from "@spectrum-icons/workflow/Info";
import { useFocus } from '../util';
import SpectrumProvider from '../additional/SpectrumProvider';
interface WithInput {
  input: any;
  noToolbar?: boolean;
  returnMode?: 'html' | 'json' | 'text' | 'markdown';
}

export const SpectrumInputControl = (props: ControlProps & WithInput) => {
  const [_, onFocus, onBlur] = useFocus();
  const { description, id, errors, uischema, visible, config, input, data, schema } = props;
  const newProps = {...props, ...{data: data || schema?.default}}
  const InnerComponent = input;
  // console.log("INPUT", input);

  const isValid = errors.length === 0;
  // const appliedUiSchemaOptions = merge({}, config, uischema.options);

  // const showDescription = !isDescriptionHidden(
  //   visible,
  //   description,
  //   focused,
  //   appliedUiSchemaOptions.showUnfocusedDescription
  // );

  // console.log("SpectrumInputControl", props, isValid)
  
  let info = null
  if (description) {
    info = (
      <ContextualHelp variant="info">
        <Content>
          <Text>
            {description}
          </Text>
        </Content>
      </ContextualHelp>
      // <View>
      //   <TooltipTrigger delay={1000}>
      //     <ActionButton isQuiet margin={0} height={16} width={16} isDisabled={false} >
      //       <Info size='XS' height={16} width={16} />
      //     </ActionButton>
      //     <Tooltip>{description} asdasd</Tooltip>
      //   </TooltipTrigger>
      // </View>
    )
  }

  return (
    <div
      onFocus={onFocus}
      onBlur={onBlur}
      hidden={visible === undefined || visible === null ? false : !visible}
      id={id}
    >
      <SpectrumProvider>
          <Flex direction='column' UNSAFE_className='custom-tooltip-parent'>
            <InnerComponent {...newProps} id={id && `${id}-input`} isValid={isValid} label={<>{props.label}{info}</>} />
            <View>
              <Text>{!isValid ? errors : null}</Text>
            </View>
          </Flex>
      </SpectrumProvider>
    </div>
  );
};
