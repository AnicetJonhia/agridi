import { useEffect, useState } from 'react';
import useUserStore from '@/stores/userStore';

const Blogs = () => {
  const { users, fetchAllUsers } = useUserStore(); // Assurez-vous que users est bien récupéré
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      await fetchAllUsers(); // Appel pour récupérer les utilisateurs
      setLoading(false);
    };
    fetchProfile();
  }, [fetchAllUsers]);

  return (
    <div>
      <h2>Liste des utilisateurs</h2>
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <ul>
          {users.length > 0 ? (
            users.map((user) => (
              <li key={user.id}>{user.username} {user.email}</li> // Utilisation de `username` pour l'affichage
            ))
          ) : (
            <p>Aucun utilisateur trouvé.</p>
          )}
        </ul>
      )}
    </div>
  );
};

export default Blogs;
