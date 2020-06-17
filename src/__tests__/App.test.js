import React from "react";
import { render, fireEvent, act } from "@testing-library/react";
import MockAdapter from "axios-mock-adapter";
import api from "../services/api";

const apiMock = new MockAdapter(api);

import App from "../App";

const wait = (amount = 0) => {
  return new Promise((resolve) => setTimeout(resolve, amount));
};

const actWait = async (amount = 0) => {
  await act(async () => {
    await wait(amount);
  });
};

describe("App component", () => {
  it("should be able to add new repository", async () => {
    const { getByText, getByTestId, getByLabelText } = render(<App />);

    apiMock.onGet("repositories").reply(200, []);

    apiMock.onPost("repositories").reply(200, {
      id: "123",
      url: "https://github.com/josepholiveira",
      title: "Desafio ReactJS",
      techs: ["React", "Node.js"],
    });

    await actWait();

    const inputTitle = getByLabelText("Título do repositório", {
      selector: "input",
    });
    fireEvent.change(inputTitle, {
      target: { name: "title", value: "Desafio ReactJS" },
    });

    const inputUrl = getByLabelText("Url", {
      selector: "input",
    });
    fireEvent.change(inputTitle, {
      target: { name: "url", value: "https://github.com/josepholiveira" },
    });

    const inputTechs = getByLabelText("Tecnologias", {
      selector: "input",
    });
    fireEvent.change(inputTitle, {
      target: { name: "techs", value: ["React", "Node.js"] },
    });

    fireEvent.click(getByText("Adicionar"));

    await actWait();

    const repositoryList = getByTestId("repository-list");
    const li = repositoryList.firstChild;

    expect(li.children[0]).toHaveTextContent("Desafio ReactJS");
    expect(li.children[1]).toHaveTextContent(
      "https://github.com/josepholiveira"
    );
    expect(li.children[2]).toHaveTextContent("React,Node.js");
  });

  it("should be able to remove repository", async () => {
    const { getByText, getByTestId } = render(<App />);

    apiMock.onGet("repositories").reply(200, [
      {
        id: "123",
        url: "https://github.com/josepholiveira",
        title: "Desafio ReactJS",
        techs: ["React", "Node.js"],
      },
    ]);

    apiMock.onDelete("repositories/123").reply(204);

    await actWait();

    fireEvent.click(getByText("Remover"));

    await actWait();

    expect(getByTestId("repository-list")).toBeEmpty();
  });

  it("should be able to like a repository", async () => {
    const { getByText, getByTestId } = render(<App />);

    apiMock.onGet("repositories").reply(200, [
      {
        id: "123",
        url: "https://github.com/josepholiveira",
        title: "Desafio ReactJS",
        techs: ["React", "Node.js"],
        likes: 1,
      },
    ]);

    apiMock.onPost("repositories/123/like").reply(200, {
      id: "123",
      url: "https://github.com/josepholiveira",
      title: "Desafio ReactJS",
      techs: ["React", "Node.js"],
      likes: 2,
    });

    await actWait();

    fireEvent.click(getByTestId("like"));

    await actWait();

    const repositoryList = getByTestId("repository-list");
    const li = repositoryList.firstChild;
    expect(li.children[3]).toHaveTextContent("2");
  });
});
