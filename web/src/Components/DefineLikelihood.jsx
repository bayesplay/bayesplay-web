import React, { useContext } from "react";
import { LikelihoodContext, ModelContext } from "../Contexts/Contexts.jsx";
import { useStyles } from "../Styles";
import { Likelihood } from "../Likelihoods/Likelihoods.jsx";

import {
  Select,
  InputLabel,
  MenuItem,
  Grid,
  Typography,
  FormControl,
  FormHelperText,
} from "@material-ui/core";

const likelihoods = [
  "normal",
  "student t",
  "binomial",
  "noncentral t",
  "noncentral d",
  "noncentral d2",
];

export function DefineLikelihood() {
  const { setLikelihoodDef } = useContext(LikelihoodContext);
  // const likelihoodParam = ReadLikelihoodName()
  const [likelihood, setLikelihood] = React.useState([]);
  const { model, setModel } = useContext(ModelContext);
  const handleChange = (event) => {
    setLikelihood(event.target.value);
    setLikelihoodDef({ distribution: event.target.value });
    setModel({
      ...model,
      ...{ likelihoodDef: { distribution: event.target.value } },
    });
  };

  const classes = useStyles();

  return (
    <>
      <Grid
        item
        spacing={1}
        style={{ paddingBottom: 10, lineHeight: "2rem", maxWidth: "18em" }}
      >
        <Typography variant="subtitle">
          Define your <em>likelihood</em>
        </Typography>
        <Typography variant="body1">
          The likelihood is the <em>model of the data</em>{" "}
        </Typography>
        {/* <Typography variant = "body2"><Link variant="body2">Read more...</Link></Typography> */}
      </Grid>
      <Grid container direction="column" spacing={3}>
        <Grid item>
          <FormControl>
            <InputLabel>Likelihood</InputLabel>
            <Select
              className={classes.selectEmpty}
              value={likelihood}
              onChange={handleChange}
              id="likelihood_select"
              data-testid="i"
            >
              <MenuItem value="" disabled>
                Distribution
              </MenuItem>
              {likelihoods.map((name) => (
                <MenuItem key={name} value={name} id="likelihood_value">
                  {name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Distribution family</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item>
          <Likelihood type={likelihood}></Likelihood>
        </Grid>
      </Grid>
    </>
  );
}
