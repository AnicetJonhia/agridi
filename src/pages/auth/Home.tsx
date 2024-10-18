import React from 'react';
import Translate from '@/components/Translate';
import Description from "@/components/home/Description";
import Resume from "@/components/home/Resume.tsx";
import Welcome from "@/components/home/Welcome.tsx";

const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center space-y-2 mt-2">
      {/* Optional Title */}
      {/*<h2 className="text-2xl font-bold text-center text-gray-800 mb-4">*/}
      {/*  <Translate str="welcome"  />*/}
      {/*</h2>*/}

      {/* Optional Description */}
      {/*<p className="text-gray-600 text-center mb-6">*/}
      {/*  <Translate str="description"  />*/}
      {/*</p>*/}

      {/* Flex container for Welcome and Resume */}
      <div className="flex flex-col md:flex-row justify-center items-start ml-1 w-full space-y-4 md:space-y-0 md:space-x-4">
        <Welcome />
        <Resume />
      </div>

      <Description />
    </div>
  );
};

export default Home;
