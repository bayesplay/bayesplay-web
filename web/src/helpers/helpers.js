// var model = {
// distribution: "binomial",
// parameters: { successes: 10, trials: 10 },
// };

// var template = {
// parameters: { successes: "number", trials: "number" },
// };

export function checkModel(model, template) {
  var top_level = Object.keys(template)[0];
  if (!Object.keys(model).includes(top_level)) {
    return false;
  }

  var checks = [];
  var keys = Object.keys(model[top_level]);
  for (let i = 0; i < keys.length; i++) {
    if (typeof model[top_level][keys[0]] != template[top_level][keys[0]]) {
      checks.push(false);
    } else {
      checks.push(true);
    }
  }
  return checks.every((x) => x === true);
}

export function noNaNs(model) {
  var x = Object.entries(model.parameters);
  return x.map((x) => isNaN(parseFloat(x[1]))).every((x) => x === false);
}

export function hasKey(obj, value) {
  if (Object.keys(obj).includes(value) === false) {
    return false;
  } else {
    return true;
  }
}

export function missingKey(obj, value) {
  if (Object.keys(obj).includes(value) === false) {
    return true;
  } else {
    return false;
  }
}

export function getParam(object, param){

  if(Object.keys(object).includes("parameters")===false){
    return "NA"
  }

  if(Object.keys(object.parameters).includes(param)){
    return object.parameters[param]
  } else {
    return "NA"
  }

}

export function round(value, dp){
  if (value === null) {
    return null;
  }
  var bigValue = value * 10 ** dp;
  return Math.round(bigValue) / 10 ** dp;
};
