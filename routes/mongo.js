const { MongoClient, ServerApiVersion } = require('mongodb');

const uri =
  'mongodb+srv://tetz:qwer1234@cluster0.sdiakr0.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

// async function main() {
//   await client.connect();

//   const users = client.db('kdt1').collection('board');

//   await users.deleteMany({});

//   await users.insertMany([
//     {
//       title: 'test1',
//       content: 'test1',
//     },
//     {
//       title: 'test2',
//       content: 'test2',
//     },
//   ]);

//   await client.close();
// }

// main();

module.exports = client;
