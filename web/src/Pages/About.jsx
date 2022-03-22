import React from "react";

import { Grid, Paper, Typography } from "@material-ui/core";

export function About() {
  return (
    <React.Fragment>
      <Grid container direction="column" spacing={1}>
        <Grid item>
          <Paper square style={{ padding: 15 }}>
            <Typography variant="subtitle2" style={{ lineHeight: "200%" }}>
              About this page
            </Typography>
            <Typography variant="body1" style={{ lineHeight: "150%" }}>
              This website is designed as a companion to the{" "}
              <code>bayesplay</code> <code>R</code> package. Details about the{" "}
              <code>R</code> package can be found{" "}
              <a
                href="https://bayesplay.github.io/bayesplay/"
                target="_blank"
                rel="noreferrer"
              >
                here
              </a>
              .
            </Typography>

            <Typography variant="body1" style={{ lineHeight: "150%" }}>
              This website is still in Beta, so if you find any errors please
              report them to{" "}
              <a href="mailto:bayesplay@colling.net.nz">
                bayesplay@colling.net.nz
              </a>
              .
            </Typography>

            <Typography variant="body1" style={{ lineHeight: "150%" }}>
              To learn more about how the computations on this website are
              performed, checkout the{" "}
              <a href="https://github.com/ljcolling/go-bayesfactor">
                go-bayesfactor
              </a>{" "}
              package.
            </Typography>
          </Paper>
          <Paper square style={{ padding: 15 }} spacing={2}>
            <Typography variant="subtitle2" style={{ lineHeight: "200%" }}>
              Learning more about Bayes factors
            </Typography>
            <Typography variant="body1" style={{ lineHeight: "150%" }}>
              A companion tutorial paper for the <code>bayesplay</code>{" "}
              <code>R</code> package and this website will be available shortly.
              Stay tuned for details.
            </Typography>
          </Paper>
          <Paper square style={{ padding: 15 }} spacing={2}>
            <Typography variant="subtitle2" style={{ lineHeight: "200%" }}>
              About the developer
            </Typography>
            <Typography variant="body1" style={{ lineHeight: "150%" }}>
              This was developed by me, Lincoln Colling. I'm a lecturer at the{" "}
              <a
                href="https://profiles.sussex.ac.uk/p488921-lincoln-colling"
                target="_blank"
                rel="noreferrer"
              >
                University of Sussex
              </a>
              , where I teach quantitative methods and computing for Psychology
              and Cognitive Neuroscience. I also do research on Philosopy of
              Cognitive Science, statistical inference, numerical cognition, and
              embodied cognition. You can read more about my research at{" "}
              <a
                href="https://research.colling.net.nz"
                target="_blank"
                rel="noreferrer"
              >
                research.colling.net.nz
              </a>
              .
            </Typography>
          </Paper>

          <Paper square style={{ padding: 15 }} spacing={2}>
            <Typography variant="subtitle2" style={{ lineHeight: "200%" }}>
              References
            </Typography>
            <Typography variant="body1" style={{ lineHeight: "150%" }}>
              Colling, L.J. (2021). ljcolling/go-bayesfactor: (Version v0.9.0).
              <i>Zenodo.</i> doi:{" "}
              <a href="https://doi.org/10.5281/zenodo.4642331">
                10.5281/zenodo.4642331
              </a>
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      <Grid style={{ padding: 20, display: "flex", justifyContent: "center" }}>
        &copy; 2021 Lincoln Colling
      </Grid>
    </React.Fragment>
  );
}
