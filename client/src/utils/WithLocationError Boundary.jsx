/* eslint-disable react/prop-types */

import { useLocation } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';

const WithLocationErrorBoundary = ({ children }) => {
  const location = useLocation();

  return (
    <ErrorBoundary location={location}>
      {children}
    </ErrorBoundary>
  );
};

export default WithLocationErrorBoundary;
