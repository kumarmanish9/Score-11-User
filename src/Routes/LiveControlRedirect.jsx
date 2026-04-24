import { useParams, Navigate } from 'react-router-dom';

const LiveControlRedirect = () => {
  const { id } = useParams();
  return <Navigate to={`/match/${id}/live-control`} replace />;
};

export default LiveControlRedirect;

