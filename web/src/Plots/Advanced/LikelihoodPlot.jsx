
import React from "react";
import { VegaLite } from "react-vega";

// UI components
import {
  // Switch as ToggleSwitch,
  // FormControlLabel,
  Typography
} from "@material-ui/core";


import { Markdown } from "../../Components/Markdown";
import { useMediaQuery } from "react-responsive";

export function Likelihoodplot({ compute }) {
  const isMobile = useMediaQuery({
    query: "(min-device-width: 450px)",
  });
  const likelihoodSpec = {
    width: !isMobile ? 180 : 350,
    height: 200,
    title: "Likelihood",
    mark: "line",
    actions: false,
    encoding: {
      x: { field: "x", type: "quantitative", title: "θ" },
      y: { field: "y", type: "quantitative", title: "Density" },
      color: { value: "black" },
    },
    data: { name: "table" },
  };

  return (
    <>
      <VegaLite
        spec={likelihoodSpec}
        data={{ table: compute.likelihoodPlotData }}
        actions={{
          export: true,
          source: false,
          compiled: false,
          editor: false,
        }}
        renderer={"svg"}
      />
      <Typography variant="body1" style={{ lineHeight: "150%" }}>
        <Markdown>**Figure 1**: The likelihood function</Markdown>
      </Typography>
    </>
  );
}
