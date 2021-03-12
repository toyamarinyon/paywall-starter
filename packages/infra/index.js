'use strict';
const pulumi = require('@pulumi/pulumi');
const gcp = require('@pulumi/gcp');

// Create a GCP resource (Storage Bucket)
const bucket = new gcp.storage.Bucket('my-bucket', {
  cors: [
    {
      methods: ['POST'],
      origins: ['*'],
      responseHeaders: ['*'],
    },
  ],
  forceDestroy: true,
});
const publicRule = new gcp.storage.DefaultObjectAccessControl("publicRule", {
  bucket: bucket.name,
  role: "READER",
  entity: "allUsers",
});;
// Export the DNS name of the bucket
exports.bucketName = bucket.url;
