import { parsePrior } from "./parsePrior.js";
import { parseLikelihood } from "./parseLikelihood.js";

export const parseModel = (fullmodel, advanced) => {
  // const fullmodel = props.children
  const likelihood = fullmodel.likelihoodDef;
  const altPrior = fullmodel.altpriorDef;
  const nullPrior = fullmodel.nullpriorDef;
  const parseLik = parseLikelihood(likelihood);
  const parseAlt = parsePrior(altPrior, "alt");
  const parseNull = parsePrior(nullPrior, "null");
  let advancedoutput = `
# generate the plots

# plot the likelihood
plot(data_model)

# plot the two priors
plot(alt_prior)
plot(null_prior)
`;
  if (advanced === true) {
    advancedoutput = `
# generate the plots
# figure 1
plot(data_model)

# figure 2 (prior only)
plot(alt_prior)

# figure 2 (prior and posterior)
alt_posterior <- extract_posterior(m1)
plot(alt_posterior, add_prior = TRUE)


# figure 3 (prior only)
plot(null_prior)

# figure 3 (prior and posterior)
null_posterior <- extract_posterior(m0)
plot(null_posterior, add_prior = TRUE)


# figure 4 (marginal model predictions)
m1_predictions <- extract_predictions(m1)
m0_predictions <- extract_predictions(m0)
visual_compare(m1_predictions, m0_predictions)

# figure 4 (ratio of marginal model predictions)
visual_compare(m1_predictions, m0_predictions, ratio = TRUE)`;
  }

  const model_code = `# if the bayesplay package is not installed then install it with
# install.package("bayesplay")
# load the bayesplay package
library(bayesplay)

# define likelihood
${parseLik}

# define alternative prior
${parseAlt}

# define null prior
${parseNull}

# weight likelihood by prior
m1 <- data_model * alt_prior
m0 <- data_model * null_prior

# take the intergal of each weighted likelihood 
# and divide them
bf <- integral(m1) / integral(m0)

# get a verbal description of the Bayes factor
summary(bf)

${advancedoutput}
`;

  return model_code;
};
