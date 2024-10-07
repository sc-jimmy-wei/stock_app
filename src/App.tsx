import React from 'react';

import 'bootstrap/dist/css/bootstrap.css';
import SearchStock from './SearchStock';
import Portfolio from './Portfolio';


const App: React.FC = () => {
  return (
    <div className="App">
      <SearchStock />
      <Portfolio />
    </div>
  );
};

export default App;
