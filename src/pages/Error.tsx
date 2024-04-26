import { useRouteError } from 'react-router-dom';

const ErrorPage = () => {
  const error: any = useRouteError();

  return <h1>Serror{error}</h1>;
};

export default ErrorPage;
