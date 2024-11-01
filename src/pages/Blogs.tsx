import React, { useEffect } from 'react';
import useUserStore from '@/stores/userStore';

const Blogs: React.FC<{ userId: number }> = ({ userId=5 }) => {
  const { fetchSpecificUser, specificUser } = useUserStore();

  useEffect(() => {
    fetchSpecificUser(userId);
  }, [userId]);




  return (
    <div>
      {specificUser ? (
        <div>
          <h1>{specificUser.username}</h1>
          <p>Email: {specificUser.email}</p>
          {/* Affichez d'autres informations de l'utilisateur */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};


export default Blogs;