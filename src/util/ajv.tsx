import Ajv from 'ajv';
import { getAjv } from '@jsonforms/core';
import { useJsonForms } from '@jsonforms/react';

export interface AjvProps {
  ajv: Ajv;
}

export const withAjvProps =
  <P extends {}>(Component: React.ComponentType<AjvProps & P>) =>
  (props: P) => {
    const ctx = useJsonForms();
    const ajv = getAjv({ jsonforms: { ...ctx } });

    return <Component {...props} ajv={ajv} />;
  };

export interface HandleChangeProps {
  handleChange: (path: string, data: any) => void;
}
