import React from "react";
import InputLabel from "@material-ui/core/InputLabel";
import { TextField } from "formik-material-ui";
import { Formik, Form, Field } from "formik";

import Grid from "@material-ui/core/Grid";

import { ModelContext } from "../Contexts/Contexts.jsx";

import * as yup from "yup";

export const validationSchema = yup.object({
  alpha: yup.number().required().positive(),
  beta: yup.number().required().positive(),
});

function checkBeta(form) {
  let alpha = parseFloat(form[0].value);
  let beta = parseFloat(form[1].value);
  alpha = alpha < 0 ? null : alpha
  beta = beta < 0 ? null : beta
  return { alpha: alpha, beta: beta };
}

export const BetaPrior = (props) => {
  const { model, setModel } = React.useContext(ModelContext);
  const altpriorDef = props.getter;
  const setAltpriorDef = props.setter;
  const handleChangeGlobal = (event) => {
    setModel({ ...model, fresh: false });
    var parameters = checkBeta(event.target.form);
    setAltpriorDef({ ...altpriorDef, parameters });
  };
  return (
    <Formik
      initialValues={{ beta: "", alpha: "" }}
      onSubmit={(data) => {
        console.log(data);
      }}
      validateOnChange={true}
      validateOnBlur={true}
      validationSchema={validationSchema}
    >
      {() => (
        <Form onChange={handleChangeGlobal}>
          <Grid container direction="column" alignItems="flex-start">
            <InputLabel>Parameters</InputLabel>
            <Field
              component={TextField}
              type={"number"}
              name="alpha"
              label="alpha"
              id={"alpha_" + props.type}
            ></Field>
            <Field
              component={TextField}
              type="number"
              name="beta"
              label="beta"
              id={"beta_" + props.type}
            ></Field>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};
