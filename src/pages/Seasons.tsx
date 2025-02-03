import { useSelector } from 'react-redux';
import { RootState } from '@/stores';

const Seasons = () => {

  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);

  return (
    <div>

      <p>User ID: {typeof  user?.id}</p>

      <p>User Role: {user?.role}</p>

      <p>Token: {token}</p>
    </div>
  );
};

export default Seasons;