import {missingKey} from "../helpers/helpers"

export function normal_likelihood(model) {
  var dnormPlot = window.dnormPlot;
  if (missingKey(model, "parameters")) {
    return { table: [] };
  }

  if (missingKey(model.parameters, "mean")) {
    return { table: [] };
  }

  if (missingKey(model.parameters, "sd")) {
    return { table: [] };
  }

  var mean = model.parameters.mean// || 0;
  var sd = model.parameters.sd// || .1;

  if (mean === "undefined") {
    return {table: [{x: 0, y:0}]};
  }

  if (sd === "undefined") {
    return {table: []};
  }
  var data = dnormPlot(mean, sd);
  return { table: data };
}



export function binomial_likelihood(model) {
  var dbinomPlot = window.dbinomPlot

  if (missingKey(model, "parameters")) {
    return { table: [] };
  }

  if (missingKey(model.parameters, "successes")) {
    return { table: [] };
  }

  if (missingKey(model.parameters, "trials")) {
    return { table: [] };
  }

  var n = model.parameters.trials || 1;
  var x = model.parameters.successes || 1;


  var data = dbinomPlot(x, n)
  if (data[1].y > 0.9) {
    data[0].y = 1;
  } else {
    data[0].y = 0;
  }

  if (data[99].y > 0.9) {
    data[100].y = 1;
  } else {
    data[100].y = 0;
  }
  return { table: data };
}

export function student_t_likelihood(model) {
  var scaled_shifted_tPlot = window.scaled_shifted_tPlot
  if (missingKey(model, "parameters")) {
    return { table: [] };
  }

  if (missingKey(model.parameters, "mean")) {
    return { table: [] };
  }

  if (missingKey(model.parameters, "sd")) {
    return { table: [] };
  }

  if (missingKey(model.parameters, "df")) {
    return { table: [] };
  }

  var mean = model.parameters.mean || 0;
  var sd = model.parameters.sd || 1;
  var df = model.parameters.df || 1;
  
  var data = scaled_shifted_tPlot(mean, sd, df);
  return { table: data };
}


export function noncentral_d_likelihood(model) {
  var plot = window.noncentral_dPlot

  if (missingKey(model, "parameters")) {
    return { table: [] };
  }

  if (missingKey(model.parameters, "d")) {
    return { table: [] };
  }

  if (missingKey(model.parameters, "n")) {
    return { table: [] };
  }

  var d = model.parameters.d || 1;
  var n = model.parameters.n || 2;


  var data = plot(d, n)
  return { table: data };
}


export function noncentral_d2_likelihood(model) {
  var plot = window.noncentral_d2Plot

  if (missingKey(model, "parameters")) {
    return { table: [] };
  }

  if (missingKey(model.parameters, "d")) {
    return { table: [] };
  }

  if (missingKey(model.parameters, "n1")) {
    return { table: [] };
  }

  if (missingKey(model.parameters, "n2")) {
    return { table: [] };
  }
  var d = model.parameters.d || 1;
  var n1 = model.parameters.n1 || 2;
  var n2 = model.parameters.n2 || 2;

  var data = plot(d, n1, n2)
  return { table: data };
}

export function noncentral_t_likelihood(model) {
  var plot = window.noncentral_tPlot

  if (missingKey(model, "parameters")) {
    return { table: [] };
  }

  if (missingKey(model.parameters, "t")) {
    return { table: [] };
  }

  if (missingKey(model.parameters, "df")) {
    return { table: [] };
  }

  var t = model.parameters.t || 1;
  var df = model.parameters.df || 2;


  var data = plot(t, df)
  return { table: data };
}

