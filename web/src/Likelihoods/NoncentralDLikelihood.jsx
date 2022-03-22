

import React, { useContext } from "react";
import InputLabel from "@material-ui/core/InputLabel";
import { TextField } from "formik-material-ui";
import { Formik, Form, Field } from "formik";
import Typography from "@material-ui/core/Typography";
import * as yup from "yup";
import Grid from "@material-ui/core/Grid";
import { ModelContext } from "../Contexts/Contexts.jsx";

export const validationSchema = yup.object({
  d: yup.number().required().lessThan(10).moreThan(-10),
	n: yup.number().required().positive(),
});

function checkNoncentralD(form) {
  let d = parseFloat(form[0].value) || 0;
  let n = parseFloat(form[1].value) || 1;

  return { d: d, n: n };
}


export function NoncentralDLikelihood(props) {
  // const {likelihoodDef, setLikelihoodDef} = useContext(LikelihoodContext);
  const { model, setModel } = useContext(ModelContext);
  const likelihoodDef = props.getter;
  const setLikelihoodDef = props.setter;
  const handleChangeGlobal = (event) => {
    setModel({ ...model, fresh: false });
    var parameters = checkNoncentralD(event.target.form);
    setLikelihoodDef({ ...likelihoodDef, parameters });
  };
  return (
    <>
      <Grid
        item
        spacing={1}
        style={{ paddingBottom: 10, lineHeight: "1.2rem", maxWidth: "18em" }}
      >
        <Typography variant="body">
          You can use the noncentral d likelihood when your observation is a
          one-sample or paired samples Cohen's d
        </Typography>
      </Grid>
      <Formik
        initialValues={{ d: "", n: "" }}
        onSubmit={(data) => {
          console.log(data);
        }}
        validateOnChange={true}
        validateOnBlur={true}
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
                type={"number"}
                name="d"
                id="d_d"
                label="d"
              ></Field>
              <Field
                component={TextField}
                type="number"
                name="n"
                id="n_d"
                label="n"
              ></Field>
            </Grid>
          </Form>
        )}
      </Formik>
    </>
  );
}
