// const { MongoClient } = require('mongodb');

// async function updateScores() {
//   const mongoURI = process.env.MONGO || 'mongodb+srv://htpalnbl:MnpzXwYLiKYVhj1P@clusterspellingbee0.ehe994n.mongodb.net/?retryWrites=true&w=majority&appName=ClusterSpellingBee0';
//   const client = new MongoClient(mongoURI);

//   try {
//     await client.connect();
//     const database = client.db('test'); // Veritabanı adınızı buraya ekleyin
//     const users = database.collection('users');

//     const cursor = users.find();
//     while (await cursor.hasNext()) {
//       const user = await cursor.next();
//       if (typeof user.score === 'string') {
//         const score = parseInt(user.score, 10);
//         await users.updateOne({ _id: user._id }, { $set: { score: score } });
//       }
//     }

//     console.log('Score fields updated successfully.');
//   } finally {
//     await client.close();
//   }
// }

// updateScores().catch(console.error);