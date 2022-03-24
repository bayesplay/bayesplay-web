import {getParam} from "../helpers/helpers.js"

export function parseLikelihood(likelihood){

  const template = (family) => {
    return `likelihood(family = "${family}", `
  }

  let family
  let parameters
  switch(likelihood.distribution){

    case "binomial":
      family = template("binomial") 
      parameters = `successes = ${getParam(likelihood,"successes")}, trials = ${getParam(likelihood,"trials")})`
      break

    case "student t":
      family = template("student_t") 
      parameters = `mean = ${getParam(likelihood,"mean")}, sd = ${getParam(likelihood,"sd")}, df = ${getParam(likelihood,"df")})`
      break

    case "normal":
      family = template("normal") 
      parameters = `mean = ${getParam(likelihood,"mean")}, sd = ${getParam(likelihood,"sd")})`
      break

    case "noncentral d":
      family = template("noncentral_d") 
      parameters = `d = ${getParam(likelihood,"d")}, n = ${getParam(likelihood,"n")})`
      break

    case "noncentral t":
      family = template("noncentral_t") 
      parameters = `t = ${getParam(likelihood,"t")}, df = ${getParam(likelihood,"df")})`
      break

    case "noncentral d2":
      family = template("noncentral_d2")
      parameters = `d = ${getParam(likelihood,"d")}, n1 = ${getParam(likelihood,"n1")}, n2 = ${getParam(likelihood,"n2")})`
      break

    default:
      family = ""
      parameters = ""

  }

  return family === "" ? "" : "data_model <- " + family + parameters

}
