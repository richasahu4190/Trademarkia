import React, { useContext, useEffect } from "react";
import { observer } from "mobx-react";


import { MSTStoreContext } from "mst/store";

import AppRouter from "router/AppRouter";

const App = observer(() => {
  const {  viewStore } = useContext(MSTStoreContext);
  
  const { setLoader } = viewStore;

  return <AppRouter />;
});

export default App;
