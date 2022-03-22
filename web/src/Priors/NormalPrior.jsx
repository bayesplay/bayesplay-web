import React from "react";
import InputLabel from "@material-ui/core/InputLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { TextField, Switch } from "formik-material-ui";
import { Formik, Form, Field } from "formik";

import Grid from "@material-ui/core/Grid";

import { ModelContext } from "../Contexts/Contexts.jsx";

import * as yup from "yup";

export const validationSchema = yup.object({
  mean: yup.number().required(),
  sd: yup.number().required().positive(),
});

// functions here for checking parameters
// check normal distribution
function checkNormal(form) {
  // console.log(form);
  let mean = form[0].value;
  let sd = form[1].value;
  let LLCheck = form[2].checked;
  let ULCheck = form[3].checked;

  let min = LLCheck ? parseFloat(form[4].value) : null;
  let max = ULCheck ? parseFloat(form[5].value) : null;
  sd = parseFloat(sd) > 0 ? parseFloat(sd) : null;
  mean = sd != null ? parseFloat(mean) : null;
  return { mean: mean, sd: sd, min: min, max: max };
}

export const NormalPrior = (props) => {
  const { model, setModel } = React.useContext(ModelContext);
  const altpriorDef = props.getter;
  const setAltpriorDef = props.setter;
  const [checkedLL, setCheckedLL] = React.useState(false);
  const [checkedUL, setCheckedUL] = React.useState(false);

  const handleChangeGlobal = (event) => {
    var parameters = checkNormal(event.target.form);
    setModel({ ...model, fresh: false });
    setAltpriorDef({ ...altpriorDef, parameters });
  };
  return (
    <Formik
      initialValues={{ mean: null, sd: null }}
      handleSubmit={() => {
        console.log("submitted");
      }}
      validateOnChange={true}
      validateOnBlur={true}
      validationSchema={validationSchema}
    >
      {() => (
        <Form onChange={handleChangeGlobal}>
          {" "}
          <Grid container direction="column" alignItems="flex-start">
            <InputLabel>Parameters</InputLabel>
            <Field
              component={TextField}
              type="number"
              name="mean"
              label="mean"
              id={"mean_" + props.type}
            ></Field>
            <Field
              component={TextField}
              type="number"
              name="sd"
              label="sd"
              id={"sd_" + props.type}
            ></Field>
            <Grid container direction="row">
              <FormControlLabel
                control={
                  <Field
                    component={Switch}
                    checked={checkedLL}
                    type="checkbox"
                    size="medium"
                    color="primary"
                    tabindex="1"
                    name="checkedLL"
                    id={"ll_" + props.type}
                    onChange={(e) => {
                      setCheckedLL(e.target.checked);
                    }}
                  />
                }
                label="lower limit"
                labelPlacement="top"
              />
              <FormControlLabel
                control={
                  <Field
                    component={Switch}
                    checked={checkedUL}
                    type="checkbox"
                    size="medium"
                    color="primary"
                    tabindex="2"
                    name="checkedUL"
                    id={"ul_" + props.type}
                    onChange={(e) => {
                      setCheckedUL(e.target.checked);
                    }}
                  />
                }
                label="upper limit"
                labelPlacement="top"
              />
            </Grid>
            <Grid container direction="row">
              <Field
                component={TextField}
                style={{
                  width: 100,
                  visibility: checkedLL === true ? "visible" : "hidden",
                }}
                type="number"
                name="lower"
                label="lower"
                id={"lower_" + props.type}
              ></Field>
              <Field
                component={TextField}
                style={{
                  width: 100,
                  visibility: checkedUL === true ? "visible" : "hidden",
                }}
                type="number"
                name="upper"
                label="upper"
                id={"upper_" + props.type}
              ></Field>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

// export default {NullPrior, AltPrior}
