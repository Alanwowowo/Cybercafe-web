import { MongoClient } from "mongodb";

const cliente = new MongoClient("mongodb://127.0.0.1:27017", {
    serverSelectionTimeoutMS: 5000,
});

try {
    await cliente.connect();
    const respuesta = await cliente.db("admin").command({ ping: 1 });
    console.log("MongoDB respondió:", respuesta);
} finally {
    await cliente.close();
}