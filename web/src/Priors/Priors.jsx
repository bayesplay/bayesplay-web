import React, { useContext } from "react";

import { AltpriorContext, NullpriorContext } from "../Contexts/Contexts.jsx";

import { NormalPrior } from "./NormalPrior.jsx";
import { PointPrior } from "./PointPrior.jsx";
import { StudentTPrior } from "./StudentTPrior.jsx";
import { UniformPrior } from "./UniformPrior.jsx";
import { BetaPrior } from "./BetaPrior.jsx";
import { CauchyPrior } from "./CauchyPrior.jsx";

const NullPrior = (props) => {
  const { nullpriorDef, setNullpriorDef } = useContext(NullpriorContext);
  if (props.type === "normal") {
    return (
      <NormalPrior getter={nullpriorDef} setter={setNullpriorDef} type="null" />
    );
  } else if (props.type === "student t") {
    return (
      <StudentTPrior
        getter={nullpriorDef}
        setter={setNullpriorDef}
        type="null"
      />
    );
  } else if (props.type === "cauchy") {
    return (
      <CauchyPrior getter={nullpriorDef} setter={setNullpriorDef} type="null" />
    );
  } else if (props.type === "uniform") {
    return (
      <UniformPrior
        getter={nullpriorDef}
        setter={setNullpriorDef}
        type="null"
      />
    );
  } else if (props.type === "beta") {
    return (
      <BetaPrior getter={nullpriorDef} setter={setNullpriorDef} type="null" />
    );
  } else if (props.type === "point") {
    return (
      <PointPrior
        getter={nullpriorDef}
        setter={setNullpriorDef}
        likelihood={props.likelihood}
      />
    );
  } else {
    return <></>;
  }
};

const AltPrior = (props) => {
  const { altpriorDef, setAltpriorDef } = useContext(AltpriorContext);
  if (props.type === "normal") {
    return (
      <NormalPrior getter={altpriorDef} setter={setAltpriorDef} type="alt" />
    );
  } else if (props.type === "student t") {
    return (
      <StudentTPrior getter={altpriorDef} setter={setAltpriorDef} type="alt" />
    );
  } else if (props.type === "cauchy") {
    return (
      <CauchyPrior getter={altpriorDef} setter={setAltpriorDef} type="alt" />
    );
  } else if (props.type === "uniform") {
    return (
      <UniformPrior getter={altpriorDef} setter={setAltpriorDef} type="alt" />
    );
  } else if (props.type === "beta") {
    return (
      <BetaPrior getter={altpriorDef} setter={setAltpriorDef} type="alt" />
    );
  } else if (props.type === "point") {
    return (
      <PointPrior
        getter={altpriorDef}
        setter={setAltpriorDef}
        likelihood={props.likelihood}
      />
    );
  } else {
    return <></>;
  }
};

// export default {NullPrior, AltPrior}
export { NullPrior, AltPrior };
