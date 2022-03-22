
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
	n1: yup.number().required().positive(),
	n2: yup.number().required().positive(),
});



function checkNoncentralD2(form) {
  let d = parseFloat(form[0].value) || 0;
  let n1 = parseFloat(form[1].value) || 1;
  let n2 = parseFloat(form[2].value) || 1;
  return { d: d, n1: n1, n2: n2 };
}


export function NoncentralD2Likelihood(props) {
  // const {likelihoodDef, setLikelihoodDef} = useContext(LikelihoodContext);
  const { model, setModel } = useContext(ModelContext);
  const likelihoodDef = props.getter;
  const setLikelihoodDef = props.setter;
  const handleChangeGlobal = (event) => {
    setModel({ ...model, fresh: false });
    var parameters = checkNoncentralD2(event.target.form);
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
          You can use the noncentral d2 likelihood when your observation is
          independent samples Cohen's d.
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
                name="n1"
                id="n1_d"
                label="n1"
              ></Field>
              <Field
                component={TextField}
                type="number"
                name="n2"
                id="n2_d"
                label="n2"
              ></Field>
            </Grid>
          </Form>
        )}
      </Formik>
    </>
  );
}
