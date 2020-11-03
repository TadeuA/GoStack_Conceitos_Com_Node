const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

//middleware
//validar id
function validateRepositoriesId(request, response, next) {
  const { id } = request.params;
  if(!isUuid(id)){
    return response.status(400).json({error: "Repository not found"})
  }

  return next();
}

//utils function
//encontrar repository pelo id
function findRepository(id, response){
  
  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  if(repositoryIndex < 0 ){
    return response.status(400).json({ error: "Repository don't exist"})
  }

  return repositoryIndex;
}
// app.use('/repositories/:id', validateRepositoriesId)

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  const repository = {
    id : uuid(),
    title, 
    url, 
    techs,
    likes : 0
  }

  repositories.push(repository)


  return response.status(201).json(repository);
});

app.put("/repositories/:id", validateRepositoriesId, (request, response) => {
  const { id } = request.params

  const repositoryIndex = findRepository(id, response)

  const { title = null, url = null, techs = null } = request.body

  if(title !== null){
    repositories[repositoryIndex].title = title
  }
  if(url !== null){
    repositories[repositoryIndex].url = url
  }
  if(techs !== null){
    repositories[repositoryIndex].techs = techs
  }

  return response.json(repositories[repositoryIndex])
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = findRepository(id, response)

  repositories.splice(repositoryIndex,1)
  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositoryIndex = findRepository(id, response)
  
  repositories[repositoryIndex].likes ++;
  return response.status(201).json(repositories[repositoryIndex])
});

module.exports = app;
