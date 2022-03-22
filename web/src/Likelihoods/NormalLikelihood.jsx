import React, { useContext } from "react";
import InputLabel from "@material-ui/core/InputLabel";
import { TextField } from "formik-material-ui";
import { Formik, Form, Field } from "formik";
import Typography from "@material-ui/core/Typography";
import * as yup from "yup";
import Grid from "@material-ui/core/Grid";
import { ModelContext } from "../Contexts/Contexts.jsx";

export const validationSchema = yup.object({
  mean: yup.number().required(),
  sd: yup.number().required().positive(),
});

function checkNormal(form) {
  let mean = parseFloat(form[0].value); //|| 0;
  let sd = parseFloat(form[1].value); //|| 1;

  return { mean: mean, sd: sd };
}

export function NormalLikelihood(props) {
  // const {likelihoodDef, setLikelihoodDef} = useContext(LikelihoodContext);
  const { model, setModel } = useContext(ModelContext);
  const likelihoodDef = props.getter;
  const setLikelihoodDef = props.setter;
  const handleChangeGlobal = (event) => {
    setModel({ ...model, fresh: false });
    var parameters = checkNormal(event.target.form);
    console.log(parameters);
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
          You can use the normal likelihood when your observation is a mean or a
          mean difference
        </Typography>
      </Grid>
      <Formik
        initialValues={{ mean: "", sd: "" }}
        validateOnChange={true}
        validateOnBlur={true}
        validationSchema={validationSchema}
      >
        <Form onChange={handleChangeGlobal}>
          <Grid container direction="column" alignItems="flex-start">
            <InputLabel>Parameters</InputLabel>
            <Field
              component={TextField}
              type="number"
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
            ></Field>
          </Grid>
        </Form>
      </Formik>
    </>
  );
}
