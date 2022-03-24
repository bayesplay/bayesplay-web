import {getParam} from "../helpers/helpers.js"

export function parsePrior(prior, type){
  let family
  let parameters

  const template = (family) => {
    return `prior(family = "${family}", `
  }

  const getLimits = (prior) => {
    let min = getParam(prior,"min")
    let max = getParam(prior,"max")
    if(min === null && max === null){
      return ")"
    } else {
      
      min = min === null ? "-Inf" : min
      max = max === null ? "Inf" : max
      return `, range = c(${min}, ${max}))`
    }
  }

  switch(prior.distribution){
  
    case "normal":
      family = template("normal") 
      parameters = `mean = ${getParam(prior,"mean")}, sd = ${getParam(prior,"sd")}${getLimits(prior)}`
      break

    case "student t":
      family = template("student_t") 
      parameters = `mean = ${getParam(prior,"mean")}, sd = ${getParam(prior,"sd")}, df = ${getParam(prior,"df")}${getLimits(prior)}`
      break

    case "beta":
      family = template("beta") 
      parameters = `alpha = ${getParam(prior,"alpha")}, beta = ${getParam(prior,"beta")})`
      break

    case "cauchy":
      family = template("cauchy") 
      parameters = `location = ${getParam(prior,"location")}, scale = ${getParam(prior,"scale")}${getLimits(prior)}`
      break

    case "uniform":
      family = template("uniform") 
      parameters = `min = ${getParam(prior,"minimum")}, max = ${getParam(prior,"maximum")})`
      break

    case "point":
      family = template("point") 
      parameters = `point = ${getParam(prior,"point")})`
      break
    default:
     family = ""
     parameters = ""

  }



  return family === "" ? "" : `${type}_prior <- ` + family + parameters

}
