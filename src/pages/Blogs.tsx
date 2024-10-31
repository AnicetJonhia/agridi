import { useEffect, useState } from 'react';
import useUserStore from '@/stores/userStore';

const Blogs = () => {
  const [formData, setFormData] = useState([]);
  const { fetchAllUsers } = useUserStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const users = await fetchAllUsers(); // Assuming fetchAllUsers returns the fetched users
        setFormData(users);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [fetchAllUsers]);

  console.log("formdata",formData)

  return (
    <div>
      <h2>Liste des utilisateurs</h2>


    </div>
  );
};

export default Blogs;
