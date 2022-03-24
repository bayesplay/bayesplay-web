import React from "react";
import InputLabel from "@material-ui/core/InputLabel";
import { TextField } from "formik-material-ui";
import { Formik, Form, Field } from "formik";

import Grid from "@material-ui/core/Grid";

import { ModelContext } from "../Contexts/Contexts.jsx";

import * as yup from "yup";

export const validationSchema = yup.object({
  point: yup.number().required(),
});

function checkPoint(form) {
  let point = parseFloat(form[0].value);
  return { point: point };
}

export const PointPrior = (props) => {
  const { model, setModel } = React.useContext(ModelContext);
  const altpriorDef = props.getter;
  const setAltpriorDef = props.setter;
  const handleChangeGlobal = (event) => {
    setModel({ ...model, fresh: false });
    var parameters = checkPoint(event.target.form);
    setAltpriorDef({ ...altpriorDef, parameters });
  };
  return (
    <Formik
      initialValues={{ point: "" }}
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
              name="point"
              label="point"
              id="point_null"
            ></Field>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};
