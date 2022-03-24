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
  df: yup.number().required().positive(),
});

// check student t distribution
function checkStudentT(form) {
  // window.form = form
  let mean = form[0].value;
  let sd = form[1].value;
  let df = form[2].value;
  let LLCheck = form[3].checked;
  let ULCheck = form[4].checked;

  let min = LLCheck ? parseFloat(form[5].value) : null;
  let max = ULCheck ? parseFloat(form[6].value) : null;
  sd = parseFloat(sd) > 0 ? parseFloat(sd) : null;
  mean = sd != null ? parseFloat(mean) : null;
  df = df != null ? parseFloat(df) : null;
  return { mean: mean, sd: sd, df: df, min: min, max: max };
}

export const StudentTPrior = (props) => {
  const { model, setModel } = React.useContext(ModelContext);
  const altpriorDef = props.getter;
  const setAltpriorDef = props.setter;
  const [checkedLL, setCheckedLL] = React.useState(false);
  const [checkedUL, setCheckedUL] = React.useState(false);

  const handleChangeGlobal = (event) => {
    var parameters = checkStudentT(event.target.form);
    setModel({ ...model, fresh: false });
    setAltpriorDef({ ...altpriorDef, parameters });
  };
  return (
    <Formik
      initialValues={{ mean: null, sd: null, df: null }}
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
            <Field
              component={TextField}
              type="number"
              name="df"
              label="df"
              id={"df_" + props.type}
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
                    id={"ll_" + props.type}
                    name="checkedLL"
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
                    id={"ul_" + props.type}
                    name="checkedUL"
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
