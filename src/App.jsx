import React, { useState } from 'react'; 
import Stockform from './Stockform'; // Q1: Import the stockform component


function App() {
  const [count, setCount] = useState(0)

  return (
    
    <div>
      <Stockform />
    </div>
    
  )
}

export default App;
