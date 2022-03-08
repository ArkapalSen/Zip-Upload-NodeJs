const fs = require("fs");
const zlib = require('zlib')
const Joi = require('joi');
const Zip = require("../../controller/zip");
const { Stream } = require("stream");

const router = [
    {
        method: 'post',
        path: '/create-zip',
        options: {  
          payload: {
            maxBytes: 209715200,
            output: 'file',
            parse: true,
            allow: "multipart/form-data",
            multipart: true,     // <-- this fixed the media type error
            timeout: false,
          },
          description: "Create a zip",
          notes: "Create a zip",
          tags: ["api", "uploads"],
          plugins: {
            "hapi-swagger": {
              payloadType: "form",
            },
          },
          handler: Zip.createZip,
          validate: {
            payload: Joi.any().meta({ swaggerType: "file" }),
          },
        } 
    },
    {
      path: "/upload-zip",
      method: "post",
      options: {
        handler: Zip.uploadZip,
        description: "Upload a file",
        notes: "File upload",
        tags: ["api", "uploads"],
        plugins: {
          "hapi-swagger": {
            payloadType: "form",
          },
        },
        payload: {
          output: "file",
          parse: true,
          allow: "multipart/form-data",
          multipart: true,
          timeout: false,
        },
        validate: {
          payload: Joi.any().meta({ swaggerType: "file" }),
        },
      },
    },
    {
      path: "/read-zip",
      method: "post",
      options: {
        handler: Zip.readZip,
        description: "Read a file",
        notes: "Read a file",
        tags: ["api", "uploads"],
        plugins: {
          "hapi-swagger": {
            payloadType: "form",
          },
        },
        payload: {
          output: "file",
          parse: true,
          allow: "multipart/form-data",
          multipart: true,
          timeout: false,
        },
        validate: {
          payload: Joi.any().meta({ swaggerType: "file" }),
        },
      },
    },
]

module.exports = router