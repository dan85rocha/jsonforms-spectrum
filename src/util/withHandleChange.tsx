import React from 'react';
import { Actions } from '@jsonforms/core';
import { useJsonForms } from '@jsonforms/react';
import { HandleChangeProps } from './ajv';

export const withHandleChange =
  <P extends {}>(Component: React.ComponentType<P & HandleChangeProps>) =>
  (props: P) => {
    const ctx = useJsonForms();
    const dispatch = ctx.dispatch;
    const handleChange = React.useCallback(
      (path: string, data: any) => {
        if (dispatch) {
          dispatch(Actions.update(path, () => data));
        }
      },
      [dispatch]
    );
    return <Component {...props} handleChange={handleChange} />;
  };
