import React from "react";
import BagpipesFlow from "../components/Bagpipes/BagpipesFlow";
import { ReactFlowProvider } from 'reactflow';
import AuthenticatedRoute from "../components/Auth/AuthenticatedRoute";

const BagpipesFlowRoute = () => {
    return (

   
    <ReactFlowProvider>
      <BagpipesFlow/>
  </ReactFlowProvider>


    );

}

export default BagpipesFlowRoute;