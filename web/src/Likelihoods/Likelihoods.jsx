import React, { useContext } from "react";

import { LikelihoodContext } from "../Contexts/Contexts.jsx";


import { StudentTLikelihood } from "./StudentTLikelihood.jsx";
import {NormalLikelihood} from "./NormalLikelihood.jsx"
import {BinomialLikelihood} from "./BinomialLikelihood.jsx"
import {NoncentralDLikelihood} from "./NoncentralDLikelihood.jsx"
import {NoncentralD2Likelihood} from "./NoncentralD2Likelihood.jsx"
import {NoncentralTLikelihood} from "./NoncentralTLikelihood.jsx"



export function Likelihood(props) {
  const { likelihoodDef, setLikelihoodDef } = useContext(LikelihoodContext);

  if (props.type === "normal") {
    return (
      <NormalLikelihood getter={likelihoodDef} setter={setLikelihoodDef} />
    );
  } else if (props.type === "student t") {
    return (
      <StudentTLikelihood getter={likelihoodDef} setter={setLikelihoodDef} />
    );
  } else if (props.type === "noncentral t") {
    return (
      <NoncentralTLikelihood getter={likelihoodDef} setter={setLikelihoodDef} />
    );
  } else if (props.type === "noncentral d") {
    return (
      <NoncentralDLikelihood getter={likelihoodDef} setter={setLikelihoodDef} />
    );
  } else if (props.type === "binomial") {
    return (
      <BinomialLikelihood getter={likelihoodDef} setter={setLikelihoodDef} />
    );
  } else if (props.type === "noncentral d2") {
    return (
      <NoncentralD2Likelihood
        getter={likelihoodDef}
        setter={setLikelihoodDef}
      />
    );
  } else {
    return null;
  }
}
