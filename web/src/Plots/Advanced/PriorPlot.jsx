import React, { useState } from "react";
import { VegaLite } from "react-vega";
import { round } from "../../helpers/helpers.js";
// UI components
import {
  Switch as ToggleSwitch,
  FormControlLabel,
  Typography,
} from "@material-ui/core";

import { useMediaQuery } from "react-responsive";

export function Priorplot({ compute, type }) {
  const [showPosterior, setShowPosterior] = useState(false);

  const isMobile = useMediaQuery({
    query: "(min-device-width: 450px)",
  });
  let name = compute.names[type];
  let priorData = compute[type + "priorPlotData"];
  let posteriorData = compute[type + "posteriorPlotData"];

  const fignum = type === "alt" ? "Figure 2:" : "Figure 3:";

  priorData = priorData
    .map((el) => [{ x: el.x, y: el.y, type: "Prior" }])
    .map((x) => x[0]);
  posteriorData = posteriorData
    .map((el) => [{ x: el.x, y: el.y, type: "Posterior" }])
    .map((x) => x[0]);

  const includePosterior = { field: "type", title: null };
  const excludePosterior = { value: "black", title: null };
  const prior1 = compute["altpriorPlotData"];

  // xlimits of the plot
  const xmin = round(Math.min(...prior1.map((el) => el.x)), 3);
  const xmax = round(Math.max(...prior1.map((el) => el.x)), 3);

  const ymax = Math.max(
    ...[
      Math.max(
        ...posteriorData
          .map(({ y }) => y)
          .filter((y) => {
            return isFinite(y) ? y : 0;
          })
      ),
      Math.max(
        ...priorData
          .map(({ y }) => y)
          .filter((y) => {
            return isFinite(y) ? y : 0;
          })
      ),
    ]
  );
  const priorNonpointSpec = {
    width: !isMobile ? 180 : 350,
    height: 200,
    title: !showPosterior
      ? "Prior distribution"
      : "Prior and posterior distribution",
    actions: false,
    layer: [
      {
        mark: "line",

        encoding: {
          x: {
            field: "x",
            type: "quantitative",
            title: "θ",
            scale: { domain: [xmin, xmax], nice: true },
          },
          y: {
            field: "y",
            type: "quantitative",
            title: "Density",
            scale: { domainMin: 0, domainMax: ymax },
          },
          color: showPosterior ? includePosterior : excludePosterior,
        },
      },
    ],
    data: { name: "table" },
  };

  const priorpointSpec = {
    width: !isMobile ? 180 : 350,
    height: 200,
    title: !showPosterior
      ? "Prior distribution"
      : "Prior and posterior distribution",
    actions: false,
    layer: [
      {
        mark: "rule",
        encoding: {
          x: {
            field: "x",
            type: "quantitative",
            title: "θ",
            scale: { domain: [xmin, xmax] },
          },
          y: {
            field: "y",
            type: "quantitative",
            title: "Density",
            scale: { domainMin: 0 },
          },
          color: { value: "black" },
        },
      },
      {
        mark: "circle",
        encoding: {
          x: { field: "x", type: "quantitative", title: "θ" },
          y: { field: "y", type: "quantitative", title: "Density" },
          color: { value: "black" },
          size: { value: 80 },
        },
      },
    ],
    data: { name: "table" },
  };

  return (
    <>
      <FormControlLabel
        control={
          <ToggleSwitch
            disabled={name === "point"}
            checked={showPosterior}
            onChange={() => {
              setShowPosterior(!showPosterior);
            }}
          />
        }
        label="Show Posterior"
      />
      <VegaLite
        spec={name === "point" ? priorpointSpec : priorNonpointSpec}
        data={{
          table: !showPosterior ? priorData : posteriorData.concat(priorData),
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
        <strong>{fignum}</strong> The{" "}
        <i>{type === "alt" ? "alternative hypothesis" : "null hypothesis"}</i>{" "}
        prior distribution{showPosterior ? " and posterior distribution." : "."}
      </Typography>
    </>
  );
}
