import React, {useContext } from "react";
import {AltpriorContext, NullpriorContext} from "../Contexts/Contexts.jsx"
import {useStyles} from "../Styles";
import {AltPrior, NullPrior} from "../Priors/Priors.jsx"

import {
  Select,
  InputLabel,
  MenuItem,
  Grid,
  Typography,
  FormControl,
  FormHelperText,
} from "@material-ui/core";



const altpriors = [
  "point",
  "normal",
  "student t",
  "beta",
  "cauchy",
  "uniform",
];

const nullpriors = [
  "point",
  "normal",
  "student t",
  "beta",
  "cauchy",
  "uniform",
];


export function DefineAltprior() {
  const [altprior, setAltprior] = React.useState([]);
  const { setAltpriorDef } = useContext(AltpriorContext);
  const handleChange = (event) => {
    setAltprior(event.target.value);
    setAltpriorDef({ distribution: event.target.value });
  };

  const classes = useStyles();

  return (
    <>
      <Grid item spacing={1} style={{ paddingBottom: 10, lineHeight: "2rem", maxWidth: '18em'}}>
        <Typography variant="subtitle">
          Define your <em>alternative prior</em>
        </Typography>
        <Typography variant="body1">
          The <em>alternative prior</em> is the model of the <em>alternative hypothesis</em>
        </Typography>
        {/*<Typography variant = "body2"><Link variant="body2">Read more...</Link></Typography> */}
      </Grid>
      <Grid container direction="column" spacing={3}>
        <Grid item>
          <FormControl>
            <InputLabel>Prior</InputLabel>
            <Select
              className={classes.selectEmpty}
              value={altprior}
              onChange={handleChange}
              id="altprior_select"
            >
              <MenuItem value="" disabled>
                Distribution
              </MenuItem>
              {altpriors.map((name) => (
                <MenuItem key={name} value={name} id="altprior_value">
                  {name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Distribution family</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item>
          <AltPrior type={altprior}></AltPrior>
        </Grid>
      </Grid>
    </>
  );
}

export function DefineNullprior(props) {
  const [nullprior, setNullprior] = React.useState([]);
  const { setNullpriorDef } = useContext(NullpriorContext);
  const handleChange = (event) => {
    setNullprior(event.target.value);
    setNullpriorDef({ distribution: event.target.value });
  };

  const classes = useStyles();

  return (
    <>
      <Grid item spacing={1} style={{ paddingBottom: 10, lineHeight: "2rem", maxWidth: '18em'}}>
        <Typography variant="subtitle">
          Define your <em>null prior</em>
          
        </Typography>
        <Typography variant="body1">
          The <em>null prior</em> is the model of the <em>null hypothesis</em>
        </Typography>
        {/* <Typography variant = "body2"><Link variant="body2">Read more...</Link></Typography> */}
      </Grid>
      <Grid container direction="column" spacing={3}>
        <Grid item>
          <FormControl>
            <InputLabel>Prior</InputLabel>
            <Select
              className={classes.selectEmpty}
              value={nullprior}
              onChange={handleChange}
              id="nullprior_select"
            >
              <MenuItem value="" disabled>
                Distribution
              </MenuItem>
              {nullpriors.map((name) => (
                <MenuItem key={name} value={name} id="nullprior_value">
                  {name}
                </MenuItem>
              ))}
            </Select>
            <FormHelperText>Distribution family</FormHelperText>
          </FormControl>
        </Grid>
        <Grid item>
          <NullPrior type={nullprior} likelihood={props.likelihood}></NullPrior>
        </Grid>
      </Grid>
    </>
  );
}
