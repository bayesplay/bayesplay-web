import React, { useContext } from "react";
import InputLabel from "@material-ui/core/InputLabel";
import { TextField } from "formik-material-ui";
import { Formik, Form, Field } from "formik";
import Typography from "@material-ui/core/Typography";
import * as yup from "yup";
import Grid from "@material-ui/core/Grid";
import { ModelContext } from "../Contexts/Contexts.jsx";

export const validationSchema = yup.object({
  successes: yup.number().required().min(0).max(yup.ref("trials")),
  trials: yup.number().required().min().positive(),
});

function checkBinomial(form) {
  let successes = parseFloat(form[0].value) || 0;
  let trials = parseFloat(form[1].value) || successes + 1;

  return { successes: successes, trials: trials };
}

export function BinomialLikelihood(props) {
  // const {likelihoodDef, setLikelihoodDef} = useContext(LikelihoodContext);
  const { model, setModel } = useContext(ModelContext);
  const likelihoodDef = props.getter;
  const setLikelihoodDef = props.setter;
  const handleChangeGlobal = (event) => {
    setModel({ ...model, fresh: false });
    var parameters = checkBinomial(event.target.form);
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
          You can use the binomial likelihood when your observation is the
          number of successes in a number of trials
        </Typography>
      </Grid>
      <Formik
        initialValues={{ successes: "", trials: "" }}
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
                type="number"
                name="successes"
                id="successes_d"
                label="successes"
              ></Field>
              <Field
                component={TextField}
                type="number"
                name="trials"
                id="trials_d"
                label="trials"
              ></Field>
            </Grid>
          </Form>
        )}
      </Formik>
    </>
  );
}
