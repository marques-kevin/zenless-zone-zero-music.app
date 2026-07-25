import React, { ReactElement, useEffect } from "react";
import {
  connector,
  ContainerProps,
} from "./containers/static-initialization.container";
import { connect } from "react-redux";
import { RootState } from "@/redux/store";

const LoadingScreen: React.FC = () => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950 text-zinc-50">
    <div className="text-center">
      <div className="mb-3 text-lg font-medium">Loading music catalog...</div>
      <div className="text-sm text-zinc-400">Please wait</div>
    </div>
  </div>
);

const ErrorScreen: React.FC<{ message: string }> = ({ message }) => (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950 text-zinc-50">
    <div className="max-w-md px-6 text-center">
      <div className="mb-3 text-lg font-medium">Unable to load music catalog</div>
      <div className="text-sm text-zinc-400">{message}</div>
    </div>
  </div>
);

const CatalogGate: React.FC<{
  is_ready: boolean;
  is_loading: boolean;
  error: string | null;
  children: React.ReactNode;
}> = ({ is_ready, is_loading, error, children }) => {
  if (error) {
    return <ErrorScreen message={error} />;
  }

  if (!is_ready || is_loading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
};

const ConnectedCatalogGate = connect((state: RootState) => ({
  is_ready: state.catalog.is_ready,
  is_loading: state.catalog.is_loading,
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
