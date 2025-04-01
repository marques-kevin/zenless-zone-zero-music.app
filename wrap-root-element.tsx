import React from "react";
import { Provider } from "react-redux";
import { init } from "./src/redux/store";
import { ModuleProvider } from "./src/modules/ModuleProvider";
import { StaticInitialization } from "./src/components/static-initialization/static-initialization";

export default ({ element }) => {
  const module = new ModuleProvider().build();

  const { store } = init({}, module);
  return (
    <Provider store={store}>
      <StaticInitialization>
        <>{element}</>
      </StaticInitialization>
    </Provider>
  );
};
