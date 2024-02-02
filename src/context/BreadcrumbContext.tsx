import React from 'react';
import { Breadcrumbs } from './Breadcrumbs';

export interface NamedBreadcrumb {
  path: string;
  name?: string;
}

export interface BreadcrumbsContextType {
  breadcrumbs: Breadcrumbs;
  addBreadcrumb: (breadcrumb: NamedBreadcrumb) => void;
  deleteBreadcrumb: (path: string) => void;
  truncateBreadcrumbs: (path: string) => void;
  resetBreadcrumbs: (data: NamedBreadcrumb[]) => void;
}

export const BreadcrumbsContext = React.createContext<BreadcrumbsContextType>({
  breadcrumbs: new Breadcrumbs(),
  addBreadcrumb: () => {},
  deleteBreadcrumb: () => {},
  truncateBreadcrumbs: () => {},
  resetBreadcrumbs: () => {},
});

export const useBreadcrumbs = () => {
  const breadcrumbsContext = React.useContext(BreadcrumbsContext);
  if (breadcrumbsContext === undefined) {
    throw new Error('useBreadcrumbs must be used within a BreadcrumbsProvider');
  }
  return breadcrumbsContext;
};

export const BreadcrumbsProvider = ({ children }: { children: React.ReactNode }) => {
  const [breadcrumbs, setBreadcrumbs] = React.useState<Breadcrumbs>(new Breadcrumbs());
  const addBreadcrumb = React.useCallback(
    (breadcrumb: NamedBreadcrumb) => {
      setBreadcrumbs((breadcrumbs) => breadcrumbs.addBreadcrumb(breadcrumb));
    },
    [setBreadcrumbs]
  );
  const deleteBreadcrumb = React.useCallback(
    (path: string) => {
      setBreadcrumbs((breadcrumbs) => breadcrumbs.deleteBreadcrumb(path));
    },
    [setBreadcrumbs]
  );
  const resetBreadcrumbs = React.useCallback(
    (data: NamedBreadcrumb[]) => {
      setBreadcrumbs(new Breadcrumbs(data));
    },
    [setBreadcrumbs]
  );
  const truncateBreadcrumbs = React.useCallback(
    (path: string) => {
      setBreadcrumbs((breadcrumbs) => breadcrumbs.truncateBreadcrumbs(path));
    },
    [setBreadcrumbs]
  );

  return (
    <BreadcrumbsContext.Provider
      value={{
        breadcrumbs,
        addBreadcrumb,
        deleteBreadcrumb,
        resetBreadcrumbs,
        truncateBreadcrumbs,
      }}
    >
      {children}
    </BreadcrumbsContext.Provider>
  );
};
