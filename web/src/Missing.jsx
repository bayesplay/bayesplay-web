import {useLocation} from 'react-router-dom'

export function Missing() {
  const location = useLocation();
  return <div>404 {location.pathname} is missing</div>;
}
