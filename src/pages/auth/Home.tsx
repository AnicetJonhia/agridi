import React from 'react';
import Translate from '@/components/Translate';
import Description from "@/components/home/Description";


const Home: React.FC = () => {
  return (
    <div className={"m-1"}>
      {/*<h2>*/}
      {/*  <Translate str="welcome"  />*/}
      {/*</h2>*/}
      {/*<p>*/}
      {/*  <Translate str="description"  />*/}
      {/*</p>*/}
        <Description/>
    </div>
  );
};

export default Home;
