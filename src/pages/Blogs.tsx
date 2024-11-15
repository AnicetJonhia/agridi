import React, { useEffect } from 'react';
import useUserStore from '@/stores/userStore';
import useChatStore from '@/stores/chatStore';


const Blogs: React.FC<{ userId: number }> = ({ userId=5,groupId=3 }) => {
  const { fetchSpecificUser, specificUser } = useUserStore();
   const { groups, specificGroup, fetchGroups, fetchSpecificGroup } = useChatStore();


  useEffect(() => {
    fetchSpecificUser(userId);
  }, [userId]);

  useEffect(() => {
    fetchGroups();
    fetchSpecificGroup(groupId);
  }, [ groupId]);



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

        <hr/>
        <div>
          <h1>Groups</h1>
          <ul>
            {groups.map(group => (
                <li key={group.id}>{group.name}</li>
            ))}
          </ul>

          {specificGroup && (
              <div>
                <h2>Specific Group: {specificGroup.name}</h2>
                <ul>
                  {specificGroup.members.map(member => (
                      <><li key={member.id}>{member.username}</li>
                      <li key={member.id}>{member.email}</li>
                      </>
                  ))}
                </ul>
              </div>
          )}
        </div>
      </div>
  );
};


export default Blogs;