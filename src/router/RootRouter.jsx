import React, { useContext } from "react";
import { observer } from "mobx-react";

import { MSTStoreContext } from "mst/store";

import AppRouter from "./AppRouter";

const RootRouter = observer(() => {
  const mstStore = useContext(MSTStoreContext);
  const { domainStore } = mstStore;
  const { isUserLoggedIn } = domainStore;

  return <AppRouter />;
});

export default RootRouter;
