import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI ?? "mongodb://127.0.0.1:27017";
const cliente = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
});

export async function verificarMongo() {
    await cliente.db("admin").command({ ping: 1 });
}