import AWS from 'aws-sdk';

const r2 = new AWS.S3({
  endpoint: 'https://9e746a1cc42c9a47a6af4c8d929289ee.r2.cloudflarestorage.com',
  accessKeyId: process.env.R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  signatureVersion: 'v4',
  region: 'auto',
});

export default async function handler(req, res) {
  const { session } = req.query;
  if (!session) {
    return res.status(400).json({ error: 'Missing session parameter' });
  }
  const params = {
    Bucket: 'donald-sexton-photography',
    Prefix: `${session}/`,
  };
  try {
    const data = await r2.listObjectsV2(params).promise();
    const urls = (data.Contents || [])
      .filter(obj => obj.Key.endsWith('.JPG') || obj.Key.endsWith('.jpg'))
      .map(obj => `https://pub-d97291fa59534fa6b46e358ac977e27c.r2.dev/${obj.Key}`);
    res.status(200).json({ urls });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
} 