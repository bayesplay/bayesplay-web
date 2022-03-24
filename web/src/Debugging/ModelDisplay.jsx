// this is just for debugging!

export function ModelDisplay(props) {
  const model = props.model;
  const label = props.label;
  return (<div>
    <p>{label} definition:</p>
  <pre>{JSON.stringify(model, null, '\t')}
  </pre></div>)

}

