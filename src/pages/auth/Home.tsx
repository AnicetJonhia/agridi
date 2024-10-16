import React from 'react';
import Translate from '@/components/Translate';

const Home: React.FC = () => {
  return (
    <div>
      <h2>
        <Translate str="welcome"  />
      </h2>
      <p>
        <Translate str="description"  />
      </p>
    </div>
  );
};

export default Home;
