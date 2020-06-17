import React, { useState, useEffect } from "react";
import { AiFillLike } from "react-icons/ai";

import "./styles.css";

import api from "./services/api";

function App() {
  const [repositories, setRepositories] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    techs: [],
  });

  useEffect(() => {
    api
      .get("/repositories")
      .then((response) => {
        setRepositories(response.data);
      })
      .catch(console.log);
  }, []);

  async function handleAddRepository() {
    try {
      const { title, url, techs } = formData;

      const response = await api.post("/repositories", {
        title,
        url,
        techs: techs.split(","),
      });

      setRepositories([...repositories, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleRemoveRepository(id) {
    try {
      await api.delete(`/repositories/${id}`);

      setRepositories(repositories.filter((r) => r.id !== id));
    } catch (err) {
      console.log(err);
    }
  }

  async function handleLike(id) {
    try {
      const response = await api.post(`/repositories/${id}/like`);

      const repositoryIndex = repositories.findIndex((r) => r.id === id);

      const newRepositories = [...repositories];
      newRepositories[repositoryIndex] = response.data;

      setRepositories(newRepositories);
    } catch (err) {
      console.log(err);
    }
  }

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  return (
    <div>
      <div>
        <label htmlFor="title">Título do repositório</label>
        <input
          onChange={handleInputChange}
          type="text"
          name="title"
          id="title"
        />

        <label htmlFor="url">Url</label>
        <input onChange={handleInputChange} type="text" name="url" id="url" />

        <label htmlFor="techs">Tecnologias</label>
        <input
          onChange={handleInputChange}
          type="text"
          name="techs"
          id="techs"
        />

        <button onClick={handleAddRepository}>Adicionar</button>
      </div>
      <ul data-testid="repository-list">
        {repositories.map((repository) => (
          <li key={repository.id}>
            <h3 data-testid="repository-title">{repository.title}</h3>
            <a href={repository.url}>{repository.url}</a>
            <span>{repository.techs.join(",")}</span>

            <span>
              Curtidas: {repository.likes}
              <AiFillLike
                data-testid="like"
                onClick={() => handleLike(repository.id)}
              />{" "}
            </span>
            <button onClick={() => handleRemoveRepository(repository.id)}>
              Remover
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
