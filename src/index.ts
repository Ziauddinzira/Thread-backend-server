import express from 'express'
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

async function init() {

    const app = express();
    const PORT = Number(process.env.PORT) || 8000;

   

    const gqlServer = new ApolloServer({
        typeDefs: `
            type Query{
                hello: String
                say(name: String): String 
            }
        `,
       
        resolvers: {
            Query: {
                hello: ()=> `hey there, I am a graphql server`,
                say: (_, {name}: {name: string}) => `hey ${name}, How are you?`
            }
        }
    });
    await gqlServer.start();

    app.use(
        '/graphql',
        express.json(),
        expressMiddleware(gqlServer)
    );


    app.get('/', (req, res) => {
        res.json({ message: "server is up and running" })
    });

    // Specify the path where we'd like to mount our server

    app.listen(PORT, () => console.log(`server started at PORT:${PORT}`));
}

init();