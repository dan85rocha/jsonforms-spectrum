import React from 'react';

export interface RenderersConfigContextType {
  externalizePath: (path: string) => string;
}

export const RenderersConfigContext = React.createContext<RenderersConfigContextType>({
  externalizePath: (path) => path,
});
