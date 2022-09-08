const { MongoClient, ServerApiVersion } = require('mongodb');

const uri =
  'mongodb+srv://tetz:qwer1234@cluster0.sdiakr0.mongodb.net/?retryWrites=true&w=majority';

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

module.exports = client;

async function main() {
  await client.connect();

  const users = client.db('kdt1').collection('users');

  await users.deleteMany({});
  await users.insertMany([
    {
      id: 'tetz',
      name: '이효석',
      email: 'xenosign@naver.com',
    },
    {
      id: 'test',
      name: 'test',
      email: 'test@naver.com',
    },
  ]);
}

main();
