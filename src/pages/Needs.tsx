

import React from 'react';
import useUserStore from '@/stores/userStore';

const Needs: React.FC = () => {
  const { user } = useUserStore();
  if (!user) return null;


  return (
    <div>
      <h1>{user?.username} , what do you need???</h1>

    </div>
  );
};

export default Needs;
