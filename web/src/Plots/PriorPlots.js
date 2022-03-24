// TODO:
// normal_prior,
// student_t_prior,
// beta_prior,
// cauchy_prior,
// uniform_prior,
// point_prior
import { missingKey } from "../helpers/helpers";
// TODO: Define min and max within JS wrapper
// Figure out correct way to set limits of d / t plots
// Probably need to add another input param
export function normal_prior(model) {
  var dnormPlot = window.dnormPlotPrior;
  if (missingKey(model, "parameters")) {
    return { table: [] };
  }

  if (missingKey(model.parameters, "mean")) {
    return { table: [] };
  }

  if (missingKey(model.parameters, "sd")) {
    return { table: [] };
  }

  var mean = model.parameters.mean || 0;
  var sd = model.parameters.sd || 1;
  var min = model.parameters.min;
  var max = model.parameters.max;

  var data = dnormPlot(mean, sd, min, max);
  return { table: data };
}

export function beta_prior(model) {
  var dbinomPlot = window.dbetaPlotPrior;

  if (missingKey(model, "parameters")) {
    return { table: [] };
  }

  if (missingKey(model.parameters, "alpha")) {
    return { table: [] };
  }

  if (missingKey(model.parameters, "beta")) {
    return { table: [] };
  }

  var alpha = model.parameters.alpha || 1;
  var beta = model.parameters.beta || 1;

  var data = dbinomPlot(alpha, beta);
  // there's a better way to do this,
  // but i'm not sure what it is right now
  data[0].y = null;
  data[100].y = null;
  // if (data[1].y > 1) {
  // data[0].y = null
  // } else {
  // data[0].y = 0;
  // }

  // if (data[99].y > 0.9) {
  // data[100].y = 1;
  // } else {
  // data[100].y = 0;
  // }
  return { table: data };
}

export function uniform_prior(model) {
  var plot = window.uniformPriorPlot;

  if (missingKey(model, "parameters")) {
    return { table: [] };
  }

  if (missingKey(model.parameters, "minimum")) {
    return { table: [] };
  }

  if (missingKey(model.parameters, "maximum")) {
    return { table: [] };
  }

  var alpha = model.parameters.minimum || 0;
  var beta = model.parameters.maximum || 0;

  var data = plot(alpha, beta);
  return { table: data };
}

export function student_t_prior(model) {
  var scaled_shifted_tPlot = window.student_tPlotPrior;
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
  var min = model.parameters.min;
  var max = model.parameters.max;
  var data = scaled_shifted_tPlot(mean, sd, df, min, max);
  return { table: data };
}

export function cauchy_prior(model) {
  var plot = window.cauchyPlot_Prior;
  if (missingKey(model, "parameters")) {
    return { table: [] };
  }

  if (missingKey(model.parameters, "location")) {
    return { table: [] };
  }

  if (missingKey(model.parameters, "scale")) {
    return { table: [] };
  }

  var location = model.parameters.location || 0;
  var scale = model.parameters.scale || 1;
  var min = model.parameters.min;
  var max = model.parameters.max;
  var data = plot(location, scale, min, max);
  return { table: data };
}

export function point_prior(model) {



  if (missingKey(model, "parameters")) {
    return { table: [] };
  }

  if (missingKey(model.parameters, "point")) {
    return { table: [] };
  }


  var point = model.parameters.point || 0;
  // var min = -10;//model.parameters.min;
  // var max = 10 //model.parameters.max;
  const data = 
     [{
      x: point,
      y: 1 
    }];
  
  return { table: data }
}
