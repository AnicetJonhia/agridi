import React from 'react';
import Translate from '@/components/Translate';
import Description from "@/components/home/Description";
import Resume from "@/components/home/Resume.tsx";
import Welcome from "@/components/home/Welcome.tsx";
import Solution from "@/components/home/Solution";
import Problematic from "@/components/home/Problematic.tsx";

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

      {/* Flex container for Problematic and Solution */}
      <div className="flex flex-col md:flex-row justify-center items-start w-full space-y-4 md:space-y-0 md:space-x-4">
        <Problematic />
        <Solution />
      </div>

      <footer className="w-full py-4 text-center bg-muted/40 mt-4 border-t"> {/* Fond vert foncé */}
        <p className="text-sm text-foreground"> {/* Texte blanc pour contraste */}
          &copy; {new Date().getFullYear()} Anicet Jonhia Randrianambinina.
        </p>
      </footer>
    </div>
  );
};

export default Home;
