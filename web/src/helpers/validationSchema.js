import * as yup from "yup";

export const validationSchema = yup.object({
  mean: yup.number().required(),
  sd: yup.number().required().positive(),
  df: yup.number().required().positive(),
  t: yup.number().required().lessThan(10).moreThan(-10),
  d: yup.number().required().lessThan(10).moreThan(-10),
	n: yup.number().required().positive(),
  successes: yup.number().required().min(0).max(yup.ref("trials")),
  trials: yup.number().required().min().positive(),
});

