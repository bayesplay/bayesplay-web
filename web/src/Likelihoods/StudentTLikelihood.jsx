import React, { useContext } from "react";
import InputLabel from "@material-ui/core/InputLabel";
import { TextField } from "formik-material-ui";
import { Formik, Form, Field } from "formik";
import Typography from "@material-ui/core/Typography";
import * as yup from "yup";
import Grid from "@material-ui/core/Grid";
import { ModelContext } from "../Contexts/Contexts.jsx";

const validationSchema = yup.object({
  mean: yup.number().required(),
  sd: yup.number().required().positive(),
  df: yup.number().required().positive(),
});

function checkStudentT(form) {
  let mean = parseFloat(form[0].value) || 0;
  let sd = parseFloat(form[1].value) || 1;
  let df = parseFloat(form[2].value) || 2;

  return { mean: mean, sd: sd, df: df };
}

export function StudentTLikelihood(props) {
  const { model, setModel } = useContext(ModelContext);

  const likelihoodDef = props.getter;
  const setLikelihoodDef = props.setter;
  const handleChangeGlobal = (event) => {
    setModel({ ...model, fresh: false });
    var parameters = checkStudentT(event.target.form);
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
          You can use the student likelihood when your observation is a mean or
          a mean difference
        </Typography>
      </Grid>
      <Formik
        initialValues={{ mean: "", sd: "", df: "" }}
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
                name="mean"
                label="mean"
                id="mean_d"
              ></Field>
              <Field
                component={TextField}
                type="number"
                name="sd"
                label="sd"
                id="sd_d"
              ></Field>{" "}
              <Field
                component={TextField}
                type="number"
                name="df"
                id="df_d"
                label="df"
              ></Field>
            </Grid>
          </Form>
        )}
      </Formik>
    </>
  );
}
