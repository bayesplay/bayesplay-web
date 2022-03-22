import React, {useMemo} from 'react'

// plotting functions
// priors
import {
  normal_prior,
  student_t_prior,
  beta_prior,
  cauchy_prior,
  uniform_prior,
  point_prior,
} from "./PriorPlots";

// likelihoods

import {
  normal_likelihood,
  binomial_likelihood,
  student_t_likelihood,
  noncentral_t_likelihood,
  noncentral_d_likelihood,
  noncentral_d2_likelihood
} from "./LikelihoodPlots"

import { VegaLite } from 'react-vega'

import { useMediaQuery } from 'react-responsive'


export function LikelihoodPlot(props) {

	const model = props.model
	const distribution = model.distribution
  const isMobile = useMediaQuery({
    query: '(min-device-width: 450px)'
  })

	const likelihoodSpec = {
		width: !isMobile ? 200 : 350,
		height: 200,
		mark: 'line',
		actions: false,
		encoding: {
			x: { field: 'x', type: 'quantitative', title: "θ" },
			y: { field: 'y', type: 'quantitative', title: "Density" },
			color: { value: 'black' }
		},
		data: { name: 'table' },
	}


  var data = useMemo(() => {
    switch (distribution) {
      case "normal":
        return normal_likelihood(model);
      case "binomial":
        return binomial_likelihood(model);
      case "student t":
        return student_t_likelihood(model);
      case "noncentral d":
        return noncentral_d_likelihood(model);
      case "noncentral d2":
        return noncentral_d2_likelihood(model)
      case "noncentral t":
        return noncentral_t_likelihood(model);
      default:
        return { table: [] };
    }
  }, [distribution, model]);

  return (
	<VegaLite spec={likelihoodSpec}
		data={{ table: data.table }}
		actions={false}
		renderer={'svg'} />
  );
}


export function PriorPlot(props) {

	const model = props.model
	const distribution = model.distribution

  const isMobile = useMediaQuery({
    query: '(min-device-width: 450px)'
  })

  var data = useMemo(() => {
    switch (distribution) {
      case "normal":
        return normal_prior(model);
      case "student t":
        return student_t_prior(model);
      case "beta":
        return beta_prior(model);
      case "cauchy":
        return cauchy_prior(model);
      case "uniform":
        return uniform_prior(model);
      case "point":
        return point_prior(model);
      default:
        return { table: [] };
    }
  }, [distribution, model]);


  var limits = useMemo(() => {
				if (Object.keys(model).includes("parameters")) {
				if (Object.keys(model.parameters).includes("point")) {
					if (model.parameters.point < 1 && model.parameters.point > 0) {
						return [0, 1]
				}
					return [model.parameters.point -1, model.parameters.point + 1]
			}

		}

        return [0, 1]
  }, [model]);


	const priorNonpointSpec = {
		width: !isMobile ? 200 : 350,
		height: 200,
		mark: 'line',
		actions: false,
		encoding: {
			x: { field: 'x', type: 'quantitative', title: "θ" },
			y: { field: 'y', type: 'quantitative', title: "Density" },
			color: { value: 'black' }
		},
		data: { name: 'table' },
	}

	const priorpointSpec = {
		width: !isMobile ? 200 : 350,
		height: 200,
		actions: false,
		layer: [{
			mark: 'rule',
			encoding: {
				x: { field: 'x', type: 'quantitative', title: "θ", scale: { domain: limits } },
				y: { field: 'y', type: 'quantitative', title: "Density" },
				color: { value: "black" }
			}
		}, {
			mark: 'circle',
			encoding: {
				x: { field: 'x', type: 'quantitative', title: "θ" },
				y: { field: 'y', type: 'quantitative', title: "Density" },
				color: { value: "black" }, size: { value: 80 }
			}
		}],
		data: { name: 'table' },
	}




  return (
			<VegaLite spec={props.model.distribution === "point" ? priorpointSpec : priorNonpointSpec}
				data={{ table: data.table }}
				actions={false}
				renderer={'svg'} />
  );
}
