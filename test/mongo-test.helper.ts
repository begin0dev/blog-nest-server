import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

beforeEach(async () => {
  mongoServer = await MongoMemoryServer.create();
  global.mongoURI = mongoServer.getUri();
});

afterEach(async () => {
  await mongoServer.stop();
});
