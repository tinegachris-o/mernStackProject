const { projects, clients } = require("../sampleData.js");
const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLSchema,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
} = require("graphql");
const { Types } = require("mongoose");

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
const mutation = new GraphQLObjectType({
  name: "mutation",
  //AddMutation
  fields: {
    //ADD CLIENT
    addClient: {
      type: clientType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        phone: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        const client = new Client({
          name: args.name,
          email: args.email,
          phone: args.phone,
        });
        return client.save();
      },
    },
    //UPDATE CLIENT
    updateClient: {
      type: clientType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        phone: { type: new GraphQLNonNull(GraphQLString) },
      },
      async resolve(parent, args) {
        const updatedClient = await Client.findByIdAndUpdate(
          new Types(args.id),
          { $set: { email: args.email, phone: args.phone } },
          { new: true }
        );
        if (!updatedClient) {
          throw new Error("client not found");
        }
        return updatedClient;
      },
    },
    //delete client
    /*deleteClient: {
      type: clientType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        Project.find({ clientId: args.id }).then(() => {
          projects.forEach((project) => {
            project.remove();
          });
        });
        return Client.findByIdAndDelete(args.id);
      },
    },*/
    //DELETE CLIENT
    // delete client
    deleteClient: {
      type: clientType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        // First, find all projects associated with the client
        return Project.find({ clientId: args.id }).then((projects) => {
          // Delete all projects associated with the client
          if (projects.length > 0) {
            return Project.deleteMany({ clientId: args.id })
              .then(() => {
                // After deleting the projects, delete the client
                return Client.findByIdAndDelete(args.id);
              })
              .catch((err) => {
                throw new Error("Error deleting projects: " + err.message);
              });
          } else {
            // If no projects are found, just delete the client
            return Client.findByIdAndDelete(args.id);
          }
        });
      },
    },

    //DELETE PROJECT
    deleteProject: {
      type: projectType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        const projectId = new Types.ObjectId(args.id); // Ensure the ID is an ObjectId

        return Project.findByIdAndDelete(projectId);
      },
    },
    //UPDATE A PROJECT
    updateProject: {
      type: projectType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        id: { type: new GraphQLNonNull(GraphQLString) },
        status: {
          type: new GraphQLEnumType({
            name: "projectStatusUpdate",
            values: {
              new: { value: "Not Started" },
              IN_PROGRESS: { value: "IN_PROGRESS" }, // Change this to match your Mongoose enum
              COMPLETED: { value: "Completed" },
            },
          }),
        },
      },
      resolve(parent, args) {
        return Project.findByIdAndUpdate(
          args.id,
          {
            $set: {
              name: args.name,
              description: args.description,
              status: args.status,
            },
          },
          { new: true }
        );
      },
    },

    //Add A Project//CREATE A PROJ}ECT
    addProject: {
      type: projectType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        description: { type: new GraphQLNonNull(GraphQLString) },
        status: {
          type: new GraphQLEnumType({
            name: "ProjectStatus",
            values: {
              new: { value: "Not Started" },
              IN_PROGRESS: { value: "IN_PROGRESS" }, // Change this to match your Mongoose enum
              COMPLETED: { value: "Completed" },
            },

            //
          }),
          defaultValue: "Not Started",
        },
        clientId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parents, args) {
        const validStatuses = ["Not Started", "IN_PROGRESS", "Completed"];
        if (!validStatuses.includes(args.status)) {
          throw new Error(`Invalid status value: ${args.status}`);
        }
        const project = new Project({
          name: args.name,
          description: args.description,
          status: args.status,
          clientId: args.clientId,
        });
        return project.save();
      },
    },
  },
});

module.exports = new GraphQLSchema({ query: RootQuery, mutation });
