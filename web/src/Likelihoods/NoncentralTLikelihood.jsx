
import React, { useContext } from "react";
import InputLabel from "@material-ui/core/InputLabel";
import { TextField } from "formik-material-ui";
import { Formik, Form, Field } from "formik";
import Typography from "@material-ui/core/Typography";
import * as yup from "yup";
import Grid from "@material-ui/core/Grid";
import { ModelContext } from "../Contexts/Contexts.jsx";

export const validationSchema = yup.object({
  df: yup.number().required().positive(),
  t: yup.number().required().lessThan(10).moreThan(-10),
});


function checkNoncentralT(form) {
  let t = parseFloat(form[0].value) || 0;
  let df = parseFloat(form[1].value) || 1;

  return { t: t, df: df };
}


export function NoncentralTLikelihood(props) {
  // const {likelihoodDef, setLikelihoodDef} = useContext(LikelihoodContext);
  const { model, setModel } = useContext(ModelContext);
  const likelihoodDef = props.getter;
  const setLikelihoodDef = props.setter;
  const handleChangeGlobal = (event) => {
    setModel({ ...model, fresh: false });
    var parameters = checkNoncentralT(event.target.form);
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
          You can use the noncentral t likelihood when your observation is a t
          statistic.
        </Typography>
      </Grid>
      <Formik
        initialValues={{ t: "", df: "" }}
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
                name="t"
                id="t_d"
                label="t"
              ></Field>
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
