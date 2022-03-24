import React, { useMemo, useState, useContext } from "react";

// Contexts
import { ModelContext } from "../Contexts/Contexts.jsx"

import {
  FormControlLabel,
  Button,
  Grid,
  Paper,
  Link,
  Switch as ToggleSwitch,
} from "@material-ui/core";


import { CopyCode } from "./Code.jsx"

// helpers
import { round, missingKey, hasKey  } from "../helpers/helpers"


export function ResultsDisplay(props) {
  // const [ result, setResult] = useState(null);
  // const [copied, setCopied] = useState(false);
  const { model, setModel } = useContext(ModelContext);
  const [modelDisplay, setModelDisplay] = useState(false);
  const fullmodel = useMemo(() => {
    return {
            ...props.likelihood,
            ...props.altprior,
            ...props.nullprior,
          };

  },[props])

  const [modelMsg, setModelMsg] = useState()

  var disableCompute = useMemo(() => {
 
  // first let's check that all the models have the distribution  set
   if(missingKey(fullmodel.likelihoodDef, "distribution")) {
     setModelMsg("Likelihood is missing")
    return true
  }
   if(missingKey(fullmodel.altpriorDef, "distribution")) {

     setModelMsg("Alternative prior is missing")
    return true
  }
   if(missingKey(fullmodel.nullpriorDef, "distribution")) {
     setModelMsg("Null prior is missing")
    return true
  }
  
  

  // now let's check that they all have parameters

   if(missingKey(fullmodel.likelihoodDef, "parameters")) {
     setModelMsg("Likelihood is incomplete")
    return true
  }
   if(missingKey(fullmodel.altpriorDef, "parameters")) {
     setModelMsg("Alternative prior is incomplete")
    return true
  }
   if(missingKey(fullmodel.nullpriorDef, "parameters")) {
     setModelMsg("Null prior is incomplete")
    return true
  }

  // some more indepth model checking can be done in here
  // e.g., check things like the prior and likelihood are compatible when using 
  // a binomial likelihood
  // const msg = checkModel(fullmodel)
  
  // window.fullmodel = fullmodel
  if(hasKey(fullmodel.altpriorDef, "distribution")) {
    if(hasKey(fullmodel.nullpriorDef, "distribution")) {
        if (fullmodel.altpriorDef.distribution === "point" &&
        fullmodel.nullpriorDef.distribution !== "point") {
            setModelMsg("Use the Point prior for the Null")
          return true
        }
      }
    }


  return false
  }, [fullmodel])

  const [bf, setBf] = useState({ bf10: null, bf01: null });
  const calculate = () => {
    setModel({ ...model, fresh: true });

    const calc = async (fullmodel) => {
      const link = "./advanced?model=" + encodeURIComponent(JSON.stringify(fullmodel))
      const bf = window.bayesfactor(fullmodel);
      if (isNaN(bf)) {
        window.alert("Error with model")
        window.location.reload()
      }
      var bf10 = bf;
      var bf01 = bf === null ? null : 1 / bf;
      setBf({ bf10: bf10, bf01: bf01, link: link });
    };

    calc(fullmodel);
  };


  return (
    <>
      <Paper square style={{ padding: 20 }}>
        <Grid container direction="row" justify="space-between">
          <Button
            onClick={calculate}
            disabled={disableCompute}
            color="primary"
            variant="contained"
            id="calc_button"
          >
            Calculate
          </Button>
        </Grid>
      {disableCompute && (<pre>{modelMsg}</pre>)}
      </Paper>
      <Paper square style={{ padding: 20 }}>
        {model.fresh && (
          <>
            <div>
              <pre>
                BF<sub>10</sub> = <span id="result">{round(bf.bf10, 7)}</span>
              </pre>
            </div>
            <div>
              <pre>
                BF<sub>01</sub> = {round(bf.bf01, 7)}
              </pre>
              <div>
                <Link href={bf.link} variant="body2" target="_blank">View advanced output</Link>
              </div>
            </div>
            <FormControlLabel
              control={
                <ToggleSwitch
                  checked={modelDisplay}
                  id="show_code"
                  onChange={() => {
                    modelDisplay
                      ? setModelDisplay(false)
                      : setModelDisplay(true);
                  }}
                />
              }
              label="Show R code"
            />
            <div>
              {modelDisplay && (
                <CopyCode>{fullmodel}</CopyCode>
              )}
            </div>
          </>
        )}
      </Paper>
    </>
  );
}
