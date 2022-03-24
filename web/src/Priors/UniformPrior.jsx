import React from "react";
import InputLabel from "@material-ui/core/InputLabel";
import { TextField } from "formik-material-ui";
import { Formik, Form, Field } from "formik";

import Grid from "@material-ui/core/Grid";

import { ModelContext } from "../Contexts/Contexts.jsx";

import * as yup from "yup";

export const validationSchema = yup.object({
  minimum: yup.number().required().lessThan(yup.ref("maximum")),
  maximum: yup.number().required().moreThan(yup.ref("minimum")),
});

function checkUniform(form) {
  let minimum = parseFloat(form[0].value);
  let maximum = parseFloat(form[1].value);
  return { minimum: minimum, maximum: maximum };
}

export const UniformPrior = (props) => {
  const { model, setModel } = React.useContext(ModelContext);
  const altpriorDef = props.getter;
  const setAltpriorDef = props.setter;
  const handleChangeGlobal = (event) => {
    setModel({ ...model, fresh: false });
    var parameters = checkUniform(event.target.form);
    setAltpriorDef({ ...altpriorDef, parameters });
  };
  return (
    <Formik
      initialValues={{ trials: "", successes: "" }}
      onSubmit={(data) => {
        console.log(data);
      }}
      validateOnChange={true}
      handleChange={(values) => {
        console.log(values);
      }}
      validationSchema={validationSchema}
    >
      {() => (
        <Form onChange={handleChangeGlobal}>
          <Grid container direction="column" alignItems="flex-start">
            <InputLabel>Parameters</InputLabel>
            <Field
              component={TextField}
              type="number"
              name="minimum"
              label="minimum"
              id={"min_" + props.type}
            ></Field>
            <Field
              component={TextField}
              type="number"
              name="maximum"
              label="maximum"
              id={"max_" + props.type}
            ></Field>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};
