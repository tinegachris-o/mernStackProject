const { projects, clients } = require("../sampleData.js");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLList,
} = require("graphql");

// momgoose models
const Project = require("../models/project.js");
const Client = require("../models/client.js");

//client type
const clientType = new GraphQLObjectType({
  name: "Client",
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    name: {
      type: GraphQLString,
    },
    email: {
      type: GraphQLString,
    },
    phone: {
      type: GraphQLString,
    },
  }),
});
// projectTYpe

const projectType = new GraphQLObjectType({
  name: "Project",
  fields: () => ({
    id: {
      type: GraphQLID,
    },
    name: {
      type: GraphQLString,
    },
    description: {
      type: GraphQLString,
    },
    status: {
      type: GraphQLString,
    },
    client: {
      type: clientType,
      resolve(parent, args) {
        return Client.findById(parent.clientId);
      },
    },
  }),
});
// query methods

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    //projects
    projects: {
      type: new GraphQLList(projectType),
      resolve(parent, args) {
        return Project.find();
      },
    },
    project: {
      type: projectType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Project.findById(args.id);
      },
    },
    //clients
    clients: {
      type: new GraphQLList(clientType),
      resolve(parent, args) {
        return Client.find();
      },
    },
    client: {
      type: clientType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Client.findById(args.id);
      },
    },
  },
});
// mutations


module.exports = new GraphQLSchema({ query: RootQuery });
