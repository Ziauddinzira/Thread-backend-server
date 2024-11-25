import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { prismaClient } from './lib/db';

async function init() {
    const app = express();
    const PORT = Number(process.env.PORT) || 8000;

    // Define the GraphQL schema (typeDefs)
    const typeDefs = `
        type Query {
            hello: String
            say(name: String): String
        }

        type Mutation {
            createUser(
                firstName: String!
                lastName: String!
                email: String!
                password: String!
            ): Boolean!
        }
    `;

    // Define the resolvers
    const resolvers = {
        Query: {
            hello: () => `Hey there, I am a GraphQL server`,
            say: (_: unknown, { name }: { name: string }) => `Hey ${name}, how are you?`,
        },
        Mutation: {
            createUser: async (
                _: unknown,
                {
                    firstName,
                    lastName,
                    email,
                    password,
                }: {
                    firstName: string;
                    lastName: string;
                    email: string;
                    password: string;
                }
            ) => {
                await prismaClient.user.create({
                    data: {
                        email,
                        firstName,
                        lastName,
                        password,
                        salt: 'random_salt', // Replace with actual salt logic if necessary
                    },
                });
                return true;
            },
        },
    };

    // Initialize Apollo Server
    const gqlServer = new ApolloServer({
        typeDefs,
        resolvers,
    });
    await gqlServer.start();

    // Attach middleware to the Express app
    app.use('/graphql', express.json(), expressMiddleware(gqlServer));

    app.get('/', (req, res) => {
        res.json({ message: 'Server is up and running' });
    });

    app.listen(PORT, () => console.log(`🚀 Server started at http://localhost:${PORT}`));
}

init();
