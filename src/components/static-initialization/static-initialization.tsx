import React, { useEffect } from "react";
import {
  connector,
  ContainerProps,
} from "./containers/static-initialization.container";
import { connect } from "react-redux";
import { RootState } from "@/redux/store";

const ErrorScreen: React.FC<{ message: string }> = ({ message }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950 text-zinc-50">
    <div className="max-w-md px-6 text-center">
      <div className="mb-3 text-lg font-medium">Unable to load music catalog</div>
      <div className="text-sm text-zinc-400">{message}</div>
    </div>
  </div>
);

const CatalogGate: React.FC<{
  error: string | null;
  children: React.ReactNode;
}> = ({ error, children }) => {
  if (error) {
    return <ErrorScreen message={error} />;
  }

  return <>{children}</>;
};

const ConnectedCatalogGate = connect((state: RootState) => ({
  error: state.catalog.error,
}))(CatalogGate);

export const Wrapper: React.FC<ContainerProps> = (props) => {
  useEffect(() => {
    setTimeout(() => props.onMount());
  }, []);

  return (
    <ConnectedCatalogGate>
      <>{props.children}</>
    </ConnectedCatalogGate>
  );
};

export const StaticInitialization = connector(Wrapper);
