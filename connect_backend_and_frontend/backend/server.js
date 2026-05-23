import express from "express";
import "dotenv/config";
const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/server", (req, res) => {
  res.send("Server is Ready!");
});

// get a list of 5 jokes
app.get("/api/jokes", (req, res) => {
  // standard practice
  const jokes = [
    {
      id: 1,
      setup: "Why don't scientists trust atoms?",
      punchline: "Because they make up everything!",
    },
    {
      id: 2,
      setup: "Why did the scarecrow win an award?",
      punchline: "Because he was outstanding in his field.",
    },
    {
      id: 3,
      setup: "What do you call a fake noodle?",
      punchline: "An impasta.",
    },
    {
      id: 4,
      setup: "Why do we tell actors to 'break a leg'?",
      punchline: "Because every play has a cast.",
    },
    {
      id: 5,
      setup: "What do you call a bear with no teeth?",
      punchline: "A gummy bear!",
    },
  ];
  res.json(jokes);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// module js works asynchronously
