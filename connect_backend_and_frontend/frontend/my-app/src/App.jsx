import {useState, useEffect} from "react";
import axios from 'axios';

function App() {
  const [jokes, setJokes] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/jokes')
    .then((response) => {
      setJokes(response.data);
    })
    .catch((error) => {
      console.log(error)
    });
  }, [setJokes])

  return (
    <>
      <h1>Chai and Full Stack</h1>
      <p>Jokes: {jokes.length}</p>
      {
        jokes.map((joke) => {
          <div key={joke.id}>
            <h3>{joke.setup}</h3>
            <p>{joke.punchline}</p>
          </div>
        })
      }
    </>
  );
}

export default App;

// communicate with api from backend
// npm i axious (why ain't we not using fetch)
// we don't need to convert response into json format, its done by axios
// concept of cross origin resource sharing (different url, different ports)
// solution: whitelisting the url