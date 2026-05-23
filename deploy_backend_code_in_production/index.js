require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;

const githubData = {
  "login": "code-azeemahmad",
  "id": 182644330,
  "node_id": "U_kgDOCuLuag",
  "avatar_url": "https://avatars.githubusercontent.com/u/182644330?v=4",
  "gravatar_id": "",
  "url": "https://api.github.com/users/code-azeemahmad",
  "html_url": "https://github.com/code-azeemahmad",
  "followers_url": "https://api.github.com/users/code-azeemahmad/followers",
  "following_url": "https://api.github.com/users/code-azeemahmad/following{/other_user}",
  "gists_url": "https://api.github.com/users/code-azeemahmad/gists{/gist_id}",
  "starred_url": "https://api.github.com/users/code-azeemahmad/starred{/owner}{/repo}",
  "subscriptions_url": "https://api.github.com/users/code-azeemahmad/subscriptions",
  "organizations_url": "https://api.github.com/users/code-azeemahmad/orgs",
  "repos_url": "https://api.github.com/users/code-azeemahmad/repos",
  "events_url": "https://api.github.com/users/code-azeemahmad/events{/privacy}",
  "received_events_url": "https://api.github.com/users/code-azeemahmad/received_events",
  "type": "User",
  "user_view_type": "public",
  "site_admin": false,
  "name": null,
  "company": null,
  "blog": "",
  "location": null,
  "email": null,
  "hireable": null,
  "bio": null,
  "twitter_username": null,
  "public_repos": 24,
  "public_gists": 0,
  "followers": 4,
  "following": 5,
  "created_at": "2024-09-24T12:47:45Z",
  "updated_at": "2026-05-21T04:00:15Z"
}

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/twitter', (req, res) => {
    res.send('Twitter Code-azeem hello');
});

app.get('/youtube', (req, res) => {
    res.send('Chai aur Code youtube channel');
});

app.get('/login', (req, res) => {
    res.send('<h1>Please Log in at Chai aur Code</h1>')
});

app.get('/github', (req, res) => {
    res.json(githubData);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

/*
Hot reload is a developer tool feature that instantly injects updated code into a running application without requiring a full restart
*/