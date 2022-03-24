import React, { useState } from "react";

// For debugging purposes
import { ModelDisplay } from "../Debugging/ModelDisplay.jsx";

// UI components
import { Grid, Paper, LinearProgress, Typography } from "@material-ui/core";

// React contexts
import {
  LikelihoodContext,
  AltpriorContext,
  NullpriorContext,
  ModelContext,
} from "../Contexts/Contexts.jsx";

// Components
import { DefineLikelihood } from "../Components/DefineLikelihood.jsx";
import { DefineAltprior, DefineNullprior } from "../Components/DefinePrior.jsx";
import { ResultsDisplay } from "../Components/ResultsDisplay.jsx";

// Plots
import { LikelihoodPlot, PriorPlot } from "../Plots/Plots.jsx";

function Description() {
  return (
    <Paper square style={{ padding: 15 }} spacing={2}>
      <Typography variant="subtitle1">
        Welcome to the web app for the <code>Bayesplay</code> package
      </Typography>
      <Typography variant="body1">
        You can use this web app to calculate the same Bayes factors that you
        can calculate with the <code>Bayesplay</code> package. Once you've
        finished your calculation, you can automatically generate the{" "}
        <code>R</code> code for running the model.
      </Typography>
    </Paper>
  );
}

function checkWasm() {
  const timeout = 10000;
  const start = Date.now();
  return new Promise(waitForGo);

  function waitForGo(resolve, reject) {
    if (
      [
        "bayesfactor",
        "dnormPlot",
        "dnormPlotPrior",
        "student_tPlotPrior",
        "dbinomPlot",
        "dbetaPlotPrior",
        "scaled_shifted_tPlot",
        "noncentral_dPlot",
        "noncentral_tPlot",
        "cauchyPlot_Prior",
        "uniformPriorPlot",
        "computeAll",
      ].every((key) => Object.keys(window).includes(key))
    ) {
      resolve(true);
    } else if (timeout && Date.now() - start >= timeout)
      reject(new Error("timeout"));
    else setTimeout(waitForGo.bind(this, resolve, reject), 500);
  }
}

export function Calculate() {
  const [loading, setLoading] = React.useState({
    isLoading: true,
  });

  React.useEffect(() => {
    checkWasm().then((res) => setLoading(res));
  }, []);
  const [likelihoodDef, setLikelihoodDef] = useState([]);
  // const classes = useStyles();

  const [model, setModel] = useState({});
  const [altpriorDef, setAltpriorDef] = useState([]);
  const [nullpriorDef, setNullpriorDef] = useState([]);

//   React.useCallback((likelihoodDef) => {
//  
//     console.log(likelihoodDef)
// 
//   },[likelihoodDef])

  return (
    <React.Fragment>
      {!loading.isLoading ? (
        <React.Fragment>
          <ModelContext.Provider value={{ model, setModel }}>
            <Grid container direction="column">
              <Description />

              {/* The likelihood */}
              <Paper square style={{ padding: 15 }}>
                <LikelihoodContext.Provider
                  value={{ likelihoodDef, setLikelihoodDef }}
                >
                  <Grid container direction="row" justify="space-between">
                    <Grid item>
                      {" "}
                      <DefineLikelihood />{" "}
                    </Grid>
                    <Grid item>
                      {" "}
                      <LikelihoodPlot model={likelihoodDef} />{" "}
                    </Grid>
                  </Grid>
                </LikelihoodContext.Provider>
              </Paper>

              {/* The alternative prior */}
              <Paper square style={{ padding: 15 }}>
                <AltpriorContext.Provider
                  value={{ altpriorDef, setAltpriorDef }}
                >
                  <Grid container direction="row" justify="space-between">
                    <Grid item>
                      {" "}
                      <DefineAltprior />{" "}
                    </Grid>
                    <Grid item>
                      {" "}
                      <PriorPlot model={altpriorDef} />{" "}
                    </Grid>
                  </Grid>
                </AltpriorContext.Provider>
              </Paper>

              {/* The null prior */}
              <Paper square style={{ padding: 15 }}>
                <NullpriorContext.Provider
                  value={{ nullpriorDef, setNullpriorDef }}
                >
                  <Grid container direction="row" justify="space-between">
                    <Grid item>
                      {" "}
                      <DefineNullprior
                        likelihood={likelihoodDef.distribution}
                      />{" "}
                    </Grid>
                    <Grid item>
                      {" "}
                      <PriorPlot model={nullpriorDef} />{" "}
                    </Grid>
                  </Grid>
                </NullpriorContext.Provider>
              </Paper>
              <ResultsDisplay
                likelihood={{ likelihoodDef }}
                altprior={{ altpriorDef }}
                nullprior={{ nullpriorDef }}
              />
            </Grid>
          </ModelContext.Provider>
          {false && (
            <>
              <div>DEBUGGING</div>
              <ModelDisplay
                model={{ likelihoodDef }}
                label="likelhood"
              ></ModelDisplay>
              <ModelDisplay
                model={{ altpriorDef }}
                label="alternative prior"
              ></ModelDisplay>
              <ModelDisplay
                model={{ nullpriorDef }}
                label="null prior"
              ></ModelDisplay>
            </>
          )}
        </React.Fragment>
      ) : (
        <Paper square style={{ padding: 15 }}>
          {" "}
          <LinearProgress />
        </Paper>
      )}
    </React.Fragment>
  );
}
