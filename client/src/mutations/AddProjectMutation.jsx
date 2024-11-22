import { gql } from "@apollo/client";
//UPDATE PROJECT
const UPDATE_PROJECT=gql`
mutation updateProject(
    $id: ID!
    $name: String!
    $description: String!
    $status: ProjectStatusUpdate!
  ) {
    updateProject(description: $description, name: $name, status: $status) {
      id
      name
      description
      status
      client {
        name
        email
        phone
        id
      }
    }
  }
  `
const ADD_PROJECT = gql`
  mutation addProject(
    $clientId: ID!
    $description: String!
    $name: String!
    $status: ProjectStatus!
  ) {
    addProject(
      clientId: $clientId
      description: $description
      name: $name
      status: $status
    ) {
      id
      description
      name
      status
      client {
        name
        email
        phone
        id
      }
    }
  }
`;
//DELETE PROJECT
const DELETE_PROJECT = gql`
  mutation DeleteProject($id: ID) {
    deleteProject(id: $id) {
      id
    }
  }
`;

export { ADD_PROJECT, DELETE_PROJECT ,UPDATE_PROJECT};
