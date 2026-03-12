const crypto = require('crypto');
const Minio = require('minio');
const path = require('path');
const config = require('../config');

const client = new Minio.Client({
  endPoint: config.minio.endPoint,
  port: config.minio.port,
  useSSL: config.minio.useSSL,
  accessKey: config.minio.accessKey,
  secretKey: config.minio.secretKey,
});

const bucket = config.minio.bucket;

const inicializarBucket = async () => {
  const exists = await client.bucketExists(bucket);
  if (!exists) {
    await client.makeBucket(bucket);
  }

  const policy = {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: { AWS: ['*'] },
        Action: ['s3:GetObject'],
        Resource: [`arn:aws:s3:::${bucket}/*`],
      },
    ],
  };
  await client.setBucketPolicy(bucket, JSON.stringify(policy));
  console.log(`MinIO bucket "${bucket}" listo`);
};

const subirArchivo = async (file, userId) => {
  const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
  const objectName = `${userId}/${crypto.randomUUID()}${ext}`;

  await client.putObject(bucket, objectName, file.buffer, file.size, {
    'Content-Type': file.mimetype,
  });

  return `/storage/${bucket}/${objectName}`;
};

const eliminarArchivo = async (url) => {
  if (!url || !url.startsWith(`/storage/${bucket}/`)) return;
  const objectName = url.replace(`/storage/${bucket}/`, '');
  try {
    await client.removeObject(bucket, objectName);
  } catch (err) {
    console.error('Error eliminando archivo de MinIO:', err.message);
  }
};

module.exports = { inicializarBucket, subirArchivo, eliminarArchivo };
