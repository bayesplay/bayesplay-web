// helpers
import { getParam } from "../helpers/helpers";

import React, { useState, useEffect } from "react";
import { VegaLite } from "react-vega";

// UI components
import {
  Grid,
  Paper,
  Typography,
  Switch as ToggleSwitch,
  FormControlLabel,
  LinearProgress,
} from "@material-ui/core";

import { CopyCode } from "../Components/Code";
import { Markdown } from "../Components/Markdown";

import { useMediaQuery } from "react-responsive";

import { round } from "../helpers/helpers.js";

import { Priorplot } from "../Plots/Advanced/PriorPlot";
import {Likelihoodplot} from "../Plots/Advanced/LikelihoodPlot"


const Visualcomparison = ({ compute }) => {
  const isMobile = useMediaQuery({
    query: "(min-device-width: 450px)",
  });
  const [showRatio, setShowRatio] = useState(false);

  const PLOTPADDING = 1.05; // 5%
  const compareDomain = (compute) => {
    const min = 0;
    const max =
      Math.max(
        ...compute.comparison.map((el) => {
          return isFinite(el.y) ? el.y : 0;
        })
      ) * PLOTPADDING; // add 5% plot padding
    return [min, max];
  };
  const xmax = Math.min(
    ...[
      Math.max(
        ...compute.comparison
          .filter((x) => isFinite(x.y))
          .filter((x) => x.type === "Null model")
          .map(({ x }) => x)
      ),
      Math.max(
        ...compute.comparison
          .filter((x) => isFinite(x.y))
          .filter((x) => x.type === "Alternative model")
          .map(({ x }) => x)
      ),
    ]
  );

  const xmin = Math.max(
    ...[
      Math.min(
        ...compute.comparison
          .filter((x) => isFinite(x.y))
          .filter((x) => x.type === "Null model")
          .map(({ x }) => x)
      ),
      Math.min(
        ...compute.comparison
          .filter((x) => isFinite(x.y))
          .filter((x) => x.type === "Alternative model")
          .map(({ x }) => x)
      ),
    ]
  );

  const visualCompareSpec = {
    width: !isMobile ? 180 : 350,
    height: 200,
    actions: false,
    title: "Marginal model predictions",
    config: {
      legend: { orient: "bottom", layout: { bottom: { anchor: "middle" } } },
    },
    layer: [
      {
        mark: { type: "line", clip: true },
        encoding: {
          x: {
            field: "x",
            type: "quantitative",
            title: "Observation",
            scale: { domain: [xmin, xmax] },
          },
          y: {
            field: "y",
            type: "quantitative",
            title: "Marginal prediction",
            scale: { domain: compareDomain(compute) },
          },
          color: {
            field: "type",
            type: "nominal",
            scale: { range: ["red", "blue"] },
          },
        },
        data: { name: "table" },
      },
      {
        mark: { type: "rule", strokeDash: [4, 4] },
        encoding: {
          x: {
            field: "x",
            type: "quantitative",
            title: "Observation",
            aggregate: "mean",
          },
        },
        data: { name: "observation" },
      },
      {
        data: { name: "points" },
        mark: "circle",
        encoding: {
          x: { field: "x", type: "quantitative" },
          y: { field: "y", type: "quantitative" },
          color: {
            field: "type",
            type: "nominal",
            title: null,
            scale: { range: ["red", "blue"] },
          },
          size: { value: 80 },
        },
      },
    ],
  };

  const ratioDomain = (compute) => {
    const min =
      Math.min(
        ...compute.ratio.map((el) => {
          return isFinite(el.y) ? el.y : 0;
        })
      ) * PLOTPADDING; // add 5% more
    const max =
      Math.max(
        ...compute.ratio.map((el) => {
          return isFinite(el.y) ? el.y : 0;
        })
      ) * PLOTPADDING; // add 5% more
    return [min, max];
  };

  const ratioSpec = {
    width: !isMobile ? 180 : 350,
    height: 200,
    title: "Ratio of marginal model predictions",
    actions: false,
    layer: [
      {
        mark: { type: "rule" },
        encoding: {
          y: { field: "y", type: "quantitative", aggregate: "mean" },
          color: { value: "grey" },
        },
        data: { values: [{ y: 0 }] },
      },
      {
        mark: { type: "line", clip: true },
        encoding: {
          x: {
            field: "x",
            type: "quantitative",
            title: "Observation",
            scale: { domain: [xmin, xmax] },
          },
          y: {
            field: "y",
            type: "quantitative",
            title: "Log10 Bayes factor",
            scale: { domain: ratioDomain(compute) },
          },
          color: { value: "black" },
        },
        data: { name: "table" },
      },
      {
        mark: { type: "rule", strokeDash: [4, 4] },
        encoding: {
          x: {
            field: "x",
            type: "quantitative",
            title: "Observation",
            aggregate: "mean",
          },
        },
        data: { name: "observation" },
      },
      {
        mark: { type: "rule", strokeDash: [4, 4] },
        encoding: {
          y: { field: "y", type: "quantitative", aggregate: "mean" },
          x2: { field: "x2", type: "quantitative" },
        },
        data: { name: "observation" },
      },
      {
        data: { name: "points" },
        mark: "circle",
        encoding: {
          x: { field: "x", type: "quantitative" },
          y: { field: "y", type: "quantitative" },
          color: { value: "black" },
          size: { value: 80 },
        },
      },
    ],
  };

  const makeComparisonData = (compute) => {
    return {
      table: compute.comparison,
      observation: [{ x: compute.observation, y: compute.predictMax }],
      points: [
        {
          x: compute.observation,
          y: compute.altpoint,
          type: "Alternative model",
        },
        { x: compute.observation, y: compute.nullpoint, type: "Null model" },
      ],
    };
  };

  const makeRatioData = (compute) => {
    return {
      table: compute.ratio,
      observation: [{ x: compute.observation, y: Math.log10(compute.bf) }],
      points: [{ x: compute.observation, y: Math.log10(compute.bf) }],
    };
  };

  const comparisonData = makeComparisonData(compute);
  const ratioData = makeRatioData(compute);
  return (
    <React.Fragment>
      <FormControlLabel
        control={
          <ToggleSwitch
            checked={showRatio}
            onChange={() => {
              setShowRatio(!showRatio);
            }}
          />
        }
        label="Show Ratio"
      />
      <VegaLite
        spec={!showRatio ? visualCompareSpec : ratioSpec}
        data={{
          table: !showRatio ? comparisonData.table : ratioData.table,
          observation: !showRatio
            ? comparisonData.observation
            : ratioData.observation,
          points: !showRatio ? comparisonData.points : ratioData.points,
        }}
        actions={{
          export: true,
          source: false,
          compiled: false,
          editor: false,
        }}
        renderer={"svg"}
      />

      <Typography variant="body1" style={{ lineHeight: "150%" }}>
        <strong>Figure 4</strong>:{" "}
        {showRatio
          ? "The ratio of marginal model predictions"
          : "The marginal model predictions"}
      </Typography>
    </React.Fragment>
  );
};


function calcData(fullmodel) {
  const timeout = 10000; // set time outbefore it fails
  const start = Date.now();
  
  return new Promise(waitForGo);

  function waitForGo(resolve, reject) {
    // the WASM bundle can take a while to load so I need to check whether
    // it has been loaded before I run the analysis
    if (window.computeAll) {
      window.fullmodel = fullmodel;
      const results = window.computeAll(fullmodel)
      resolve({
        bf: results.bf,
        likelihoodPlotData: results.likelihoodPlotData,
        altpriorPlotData: results.altpriorPlotData,
        altposteriorPlotData: results.altposteriorPlotData,
        nullposteriorPlotData: results.nullposteriorPlotData,
        nullpriorPlotData: results.nullpriorPlotData,
        names: results.names,
        observation: results.observation,
        nullpoint: results.nullpoint,
        altpoint: results.altpoint,
        comparison: results.comparison,
        ratio: results.ratio,
        isLoading: results.isLoading,
      });
    } else if (timeout && Date.now() - start >= timeout)
      reject(new Error("timeout"));
    else setTimeout(waitForGo.bind(this, resolve, reject), 500); // 500ms polling
  }
}

export const Advanced = () => {
  const [compute, setCompute] = useState({
    bf: "recomputing...",
    isLoading: true,
  });

  const [modelDisplay, setModelDisplay] = useState(false);
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const model = params.get("model");
  const fullmodel = JSON.parse(decodeURIComponent(model));

  useEffect(() => {
     calcData(fullmodel).then((res) => {
      setCompute(res);
    });
    // eslint-disable-next-line
  }, []);

  const display_likelihood = (likelihood) => {
    const family = likelihood.distribution;
    var parameters;

    switch (family) {
      case "binomial":
        parameters = `$X = ${getParam(
          likelihood,
          "successes"
        )}|\\theta \\sim \\mathrm{Binomial}(p = \\theta,\\: \\mathrm{trials} = ${getParam(
          likelihood,
          "trials"
        )})$`;
        break;

      case "student t":
        parameters = `$X = ${getParam(
          likelihood,
          "mean"
        )}|\\theta \\sim \\mathrm{Scaled}$-$\\mathrm{Shifted}$-$t(\\mu = \\theta,\\: \\sigma = ${getParam(
          likelihood,
          "sd"
        )},\\: \\nu = ${getParam(likelihood, "df")})$`;
        break;

      case "normal":
        parameters = `$X = ${getParam(
          likelihood,
          "mean"
        )}|\\theta \\sim \\mathrm{Normal}(\\mu = \\theta,\\: \\sigma = ${getParam(
          likelihood,
          "sd"
        )})$`;
        break;

      case "noncentral d":
        parameters = `$X = ${getParam(
          likelihood,
          "d"
        )}\\cdot{}\\sqrt{${getParam(
          likelihood,
          "n"
        )}}|\\theta \\sim \\mathrm{Noncentral}$-$t(\\nu = ${
          getParam(likelihood, "n") - 1
        },\\: ncp = \\sqrt{${getParam(likelihood, "n")}}\\cdot{}\\theta)$`;
        break;

      case "noncentral d2":
        const mult = `\\sqrt{\\frac{${getParam(
          likelihood,
          "n1"
        )} \\cdot{}  ${getParam(likelihood, "n2")}}{ ${getParam(
          likelihood,
          "n1"
        )} + ${getParam(likelihood, "n2")}  }}`;
        parameters = `$X = ${getParam(
          likelihood,
          "d"
        )}\\cdot{}${mult}|\\theta \\sim \\mathrm{Noncentral}$-$t(\\nu = ${
          getParam(likelihood, "n1") + getParam(likelihood, "n2") - 2
        },\\: ncp = ${mult}\\cdot{}\\theta)$`;
        break;

      case "noncentral t":
        parameters = `$X = ${getParam(
          likelihood,
          "t"
        )}|\\theta \\sim \\mathrm{Noncentral}$-$t(\\nu = ${getParam(
          likelihood,
          "df"
        )},\\: ncp = \\theta)$`;
        break;

      default:
        parameters = "";
    }

    return parameters;
  };

  const display_prior = (prior) => {
    let parameters;

    const getLimits = (prior) => {
      let min = getParam(prior, "min");
      let max = getParam(prior, "max");
      if (min === null && max === null) {
        return "";
      } else {
        min = min === null ? "-\\infty" : min;
        max = max === null ? "+\\infty" : max;
        return ` $, where $ ${min} \\leq \\theta \\leq ${max}`;
      }
    };

    switch (prior.distribution) {
      case "normal":
        parameters = `mean = ${getParam(prior, "mean")}, sd = ${getParam(
          prior,
          "sd"
        )}${getLimits(prior)}`;
        parameters = `$\\theta \\sim \\mathrm{Normal}(\\mu = ${getParam(
          prior,
          "mean"
        )},\\: \\sigma = ${getParam(prior, "sd")})${getLimits(prior)}$`;
        break;

      case "student t":
        parameters = `$\\theta \\sim \\mathrm{Scaled}$-$\\mathrm{Shifted}$-$t(\\mu = ${getParam(
          prior,
          "mean"
        )},\\: \\sigma = ${getParam(prior, "sd")},\\: \\nu = ${getParam(
          prior,
          "df"
        )})${getLimits(prior)}$`;
        break;

      case "beta":
        parameters = `$\\theta \\sim \\mathrm{Beta}(\\alpha = ${getParam(
          prior,
          "alpha"
        )},\\: \\beta = ${getParam(prior, "beta")})$`;
        break;

      case "cauchy":
        parameters = `location = ${getParam(
          prior,
          "location"
        )}, scale = ${getParam(prior, "scale")}${getLimits(prior)}`;
        parameters = `$\\theta \\sim \\mathrm{Cauchy}(x_0 = ${getParam(
          prior,
          "location"
        )},\\: \\gamma = ${getParam(prior, "scale")})${getLimits(prior)}$`;
        break;

      case "uniform":
        parameters = `min = ${getParam(prior, "minimum")}, max = ${getParam(
          prior,
          "maximum"
        )}`;
        parameters = `$\\theta \\sim \\mathrm{Uniform}(\\alpha = ${getParam(
          prior,
          "minimum"
        )},\\: \\beta = ${getParam(prior, "maximum")})$`;
        break;

      case "point":
        parameters = `point = ${getParam(prior, "point")}`;
        parameters = `$\\theta = ${getParam(prior, "point")}$`;
        break;
      default:
        parameters = "";
    }

    // return (<ReactMarkdown
    // 	remarkPlugins={[remarkMath]}
    // 	rehypePlugins={[rehypeKatex]}
    // 	children={parameters} />)
    return parameters;
  };

  return (
    <React.Fragment>
      {!compute.isLoading ? (
        <React.Fragment>
          <Paper square style={{ padding: 15 }}>
            <Typography variant="subtitle2">Model definition</Typography>
            <Typography variant="body2" style={{ lineHeight: "150%" }}>
              <Markdown>{`**Likelihood:**  
                ${display_likelihood(fullmodel.likelihoodDef)}`}</Markdown>
              <Markdown>{`**Alternative Prior:**   
                ${display_prior(fullmodel.altpriorDef)}`}</Markdown>
              <Markdown>{`**Null Prior:**  
                ${display_prior(fullmodel.nullpriorDef)}`}</Markdown>
              <Markdown>
                The *Bayes factor* calculated from this model is:
              </Markdown>
              <Markdown>{`$BF_{10}$=${round(compute.bf, 2)}`}</Markdown>
              <Markdown>{`$BF_{01}$=${round(1 / compute.bf, 2)}`}</Markdown>
            </Typography>
          </Paper>
          <Paper square style={{ padding: 15 }}>
            <Typography variant="subtitle2">Plots</Typography>
            <Typography variant="body1">
              <Markdown>
                Below are the plots for the *likelihood*, and the *priors*.
              </Markdown>
            </Typography>
          </Paper>
          <Paper square style={{ padding: 15 }}>
            <Grid
              container
              alignItems="center"
              justify="center"
              direction="column"
            >
              <Likelihoodplot compute={compute}></Likelihoodplot>
            </Grid>
            <Typography variant="body1" style={{ lineHeight: "150%" }}>
              <Markdown>
                The *likelihood* function describes the relationship between the
                observed data and values of the paramater. Each point of the
                *likelihood* function represents the *conditional probability of
                obtaining the data* given *that value of the paramter*.
              </Markdown>
            </Typography>
          </Paper>

          <Paper square style={{ padding: 15 }}>
            <Grid
              container
              alignItems="center"
              justify="center"
              direction="column"
            >
              <Priorplot compute={compute} type={"alt"}></Priorplot>
            </Grid>
            <Typography variant="body1" style={{ lineHeight: "150%" }}>
              <Markdown>
                The *alternative hypothesis prior* distribution describes the
                predictions of the *alternative* hypothesis by assigning a prior
                probability to particular parameters. Using **Bayes theorem**,
                the *prior* distribution can be combined with the *likelihood*
                to generate the *posterior distribution*
              </Markdown>
            </Typography>
          </Paper>

          <Paper square style={{ padding: 15 }}>
            <Grid
              container
              alignItems="center"
              justify="center"
              direction="column"
            >
              <Priorplot compute={compute} type={"null"}></Priorplot>
            </Grid>
            <Typography variant="body1" style={{ lineHeight: "150%" }}>
              <Markdown>
                The *null hypothesis prior* distribution describes the
                predictions of the *null* hypothesis by assigning a prior
                probability to particular parameters.
              </Markdown>
            </Typography>
          </Paper>

          <Paper square style={{ padding: 15 }}>
            <Grid
              container
              alignItems="center"
              justify="center"
              direction="column"
            >
              <Visualcomparison compute={compute}></Visualcomparison>
            </Grid>
            <Typography variant="body1" style={{ lineHeight: "150%" }}>
              <Markdown>
                The *marginal model predictions* shows the *marginal likelihood*
                of different observations. The *current observation* is also
                shown on the plot. The ratio of two marginal likelihoods at a
                specific point is the Bayes factor that would be obtained for
                that observation. For visual clarity it is shown *log*
                transformed so that **0** represents equivalence between the two
                models.{" "}
              </Markdown>
            </Typography>
          </Paper>

          <Paper square style={{ padding: 15 }}>
            <p>
              To reproduce this analysis you can bookmark this page or you can
              view the corresponding R code below.
            </p>

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
              {modelDisplay && <CopyCode advanced={true}>{fullmodel}</CopyCode>}
            </div>
          </Paper>
        </React.Fragment>
      ) : (
        <Paper square style={{ padding: 15 }}>
          <p>Please wait while I load the advanced output...</p>
          <p>This might take a few seconds depending on the model...</p>
          <LinearProgress />
        </Paper>
      )}
    </React.Fragment>
  );
};
