import React from "react";
import useTokenBalances from "~/hooks/useTokenBalances";

const DataProviders = ({ children }: { children: React.ReactElement }) => {
  useTokenBalances();
  return children;
};

export default DataProviders;
