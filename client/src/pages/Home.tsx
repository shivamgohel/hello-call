import React from "react";
import CreateRoom from "../components/CreateRoom";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header at the top */}
      <header className="pt-10 text-center">
        <h1 className="text-4xl font-bold text-gray-800">
          Welcome to helloCall
        </h1>
      </header>

      {/* Main section: button centered */}
      <main className="flex-grow flex justify-center items-center">
        <CreateRoom />
      </main>
    </div>
  );
};

export default Home;
