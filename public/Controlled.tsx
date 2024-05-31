import React, { useState, useCallback, createContext, useContext, useEffect, useRef } from 'react';
import { JsonForms } from '@jsonforms/react';
import { UPDATE_DATA, Middleware } from '@jsonforms/core';
import _ from 'lodash';
import { SpectrumCells, SpectrumRenderers } from '../src';
import { Button, defaultTheme, Flex, Footer, Provider as SpectrumThemeProvider, View } from '@adobe/react-spectrum';
// import "./medium.css";
import AppTheme from './theme';

const initialData = {
  a: 1,
  b: 'Test',
  c: ['a', 'b', 'c'],
};

const initialSchema = {
  type: 'object',
  properties: {
    a: {
      type: 'number',
    },
    b: {
      type: 'string',
    },
    c: {
      type: 'array',
      items: {
        type: 'string',
        enum: ['a', 'b', 'c', 'd', 'e', 'f'],
      },
    },
  },
};

interface FormDataProps {
  data: any;
  setData: (data: any) => void;
}

interface FormSchemaProps {
  schema: any;
  setSchema: (schema: any) => void;
}

interface FormUischemaProps {
  uischema: any;
}

const FormDataContext = createContext<FormDataProps>({ data: {}, setData: () => {} });
const FormSchemaContext = createContext<FormSchemaProps>({ schema: {}, setSchema: () => {} });
const ColorSchemeContext = createContext<'light' | 'dark'>('dark');

const FormProvider = ({ children, mode }) => {
  const [data, setData] = useState({});
  const [schema, setSchema] = useState({ type: 'object' });
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(mode);

  useEffect(() => {
    setColorScheme(mode);
  }, [mode]);
  
  
  return (
    <SpectrumThemeProvider colorScheme={colorScheme} theme={AppTheme}>
      <ColorSchemeContext.Provider value={colorScheme}>
        <FormDataContext.Provider value={{ data, setData: (data) => setData(_.cloneDeep(data)) }}>
          <FormSchemaContext.Provider
            value={{ schema, setSchema: (schema) => setSchema(_.cloneDeep(schema)) }}
          >
            {children}
          </FormSchemaContext.Provider>
        </FormDataContext.Provider>
      </ColorSchemeContext.Provider>
    </SpectrumThemeProvider>
  );
};

const alphabet = 'abcdefghijklmnopqrstuvwxyz';
function getRandomLetter() {
  return alphabet[Math.floor(Math.random() * alphabet.length)];
}

interface FormViewProps {
  data: any;
  schema: any;
  uischema?: any;
}

const FormView = (props: FormViewProps) => {
  const { data, schema, uischema } = props;
  const { data: _data, setData } = useContext(FormDataContext);
  const { schema: _schema, setSchema } = useContext(FormSchemaContext);
  const [_uischema, setUischema] = useState(undefined);
  const queue = useRef([]); // ??? should we use useRef here?

  useEffect(() => {
    if (data && JSON.stringify(data) !== JSON.stringify(_data)) setData(data);
  }, [data]);

  useEffect(() => {
    if (schema && JSON.stringify(schema) !== JSON.stringify(_schema)) setSchema(schema);
  }, [schema]);

  useEffect(() => {
    if (uischema && JSON.stringify(uischema) !== JSON.stringify(_uischema)) setUischema(uischema);
  }, [uischema]);

  const evaluate = useCallback(async (path, state, newState) => {
    // assumption: this method will wait for responses before returning results
    const res: { data?: {}; schema?: {}; uischema?: {} } = {};
    console.log('EVALUATE', path, state, newState);
    res.data = { ...newState.data, a: newState.data.a + 10 };
    const newLetter = getRandomLetter();
    if (!newState.schema.properties.c.items.enum.includes(newLetter)) {
      console.log('NEW LETTER', newLetter);
      newState.schema.properties.c.items.enum.push(newLetter);
      res.schema = newState.schema;
    } else {
      console.log('IGNORED LETTER', newLetter);
    }
    return res;
  }, []);

  // const debouncedEval = getDebouncedByType(evaluate, 3000, {});

  const addToQueue = (event) => {
    queue.current.push(event);
  };

  const flush = useCallback(async () => {
    if (queue) {
      console.log('FLUSH CALLED');

      const firstEvent = _.head(queue.current);
      const lastEvent = _.last(queue.current);
      const prevState = firstEvent.prevState;
      const lastState = lastEvent.newState;
      const execOrder = new Set(queue.current.map((event) => event.action.path));
      let nextState = lastState;
      let changes = {};
      for await (const path of execOrder) {
        const changeSet = await evaluate(path, prevState, nextState);
        changes = { ...changes, ...changeSet };
        nextState = { ...nextState, ...changeSet };
      }

      if (changes) {
        for (const [key, value] of Object.entries(changes)) {
          if (key === 'data') {
            console.log('SET DATA', value);
            setData(value);
          } else if (key === 'schema') {
            console.log('SET SCHEMA', value);
            setSchema(value);
          }
        }
      }

      queue.current = []; // reset queue
    }
  }, []);

  const debouncedFlush = _.debounce(flush, 500);

  const middleware: Middleware = useCallback((prevState, action, defaultReducer) => {
    const newState = defaultReducer(prevState, action);
    switch (action.type) {
      case UPDATE_DATA: {
        console.log('ACTION', action);
        setData(newState.data); // optimistic update
        addToQueue({ action, prevState, newState });
        debouncedFlush();
        return prevState;
      }
      default:
        return newState;
    }
  }, []);

  return (
    <JsonForms
      data={_data}
      schema={_schema}
      uischema={_uischema}
      renderers={SpectrumRenderers}
      cells={SpectrumCells}
      middleware={middleware}
    />
  );
};

const PreView = () => {
  const { data } = useContext(FormDataContext);
  const { schema } = useContext(FormSchemaContext);

  return (
    <div>
      <p>{JSON.stringify(data, null, 2)}</p>
      <p>{JSON.stringify(schema, null, 2)}</p>
    </div>
  );
};

export const ControlledApp = () => {
  const [data] = useState(initialData);
  const [schema] = useState(initialSchema);

  return (
    <FormProvider mode='dark'>
      <View id="main" UNSAFE_className='scrollable-content'>
        <FormView data={data} schema={schema} />
        <PreView />
        <FormView
          data={data}
          schema={schema}
          uischema={{
            type: 'Control',
            scope: '#',
            options: {
              codeMirror: true,
            },
        }} />
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
        <p>test</p>
      </View>
      <Footer id="footer">
        <Flex direction="column" gap="size-100">
        <Flex direction="row">
          <View flex>
            Left buttons
          </View>
          <Flex direction="row" alignItems='end'>
            <View>
              <Button variant='accent'>Submit</Button>
              <Button variant='secondary' style='fill'>Cancel</Button>
            </View>
          </Flex>
        </Flex>
        <View backgroundColor={"gray-300"}>
          <Flex direction="row" gap="size-100">
            <View flex>Left side</View>
            <Flex direction="row" alignItems={'end'} >
              <View flex>Right side</View>
            </Flex>
          </Flex>
        </View>
        </Flex>
      </Footer>
    </FormProvider>
  );
};
