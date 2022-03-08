const fs = require("fs");
const zlib = require("zlib");
const homedir = require("os").homedir();
const StreamZip = require("node-stream-zip");
var unzipper = require("unzipper");
var archiver = require("archiver");
const AdmZip = require("adm-zip");
const path = require("path");
// import { Buffer } from 'buffer';
const Buffer = require("buffer");

module.exports = {
  createZip,
  uploadZip,
  readZip,
};

async function createZip(req, res) {
  const data = req.payload;
  // console.log(data.file);
  // const size = Object.keys(data.file).length;
  // console.log(size)
  // console.log(Array.isArray(data.file));

  // if (data.file) {
  //   const gzip = zlib.createGzip();
  //   const name = data.file.filename;
  //   const inp = fs.createReadStream(data.file.path);
  //   const out = fs.createWriteStream(path + ".zip");
  //   inp.pipe(gzip).pipe(out);

  //   return res.response("File zipped").code(201);
  // }

  //MULTIPLE FILES ZIP
  const path = __basedir + "/ZipFiles/" + "File.zip";
  var output = fs.createWriteStream(path);
  var archive = archiver("zip", {
    gzip: true,
    zlib: { level: 4 }, // Sets the compression level.
  });

  archive.on("error", function (err) {
    throw err;
  });

  // pipe archive data to the output file
  archive.pipe(output);

  // append files
  if (Array.isArray(data.file)) {
    data.file.forEach((element) => {
      archive.file(element.path, {
        name: element.filename,
      });
    });
  } else {
    archive.file(data.file.path, { name: data.file.filename });
  }

  //finaling
  archive.finalize();

  return res.response("File zipped").code(201);
}

async function uploadZip(req, res) {
  const data = req.payload;

  if (data.file) {
    const name = data.file.filename;
    // let fileArr = name.split(".");
    // let filename = fileArr[0];
    // let fileExt = fileArr[1];
    // if (fileExt !== "jpg") {
    //   return res.response("something went wrong").code(400);
    // }
    const path = __basedir + "/uploadsFiles/" + name;
    const inp = fs.createReadStream(data.file.path);
    const file = fs.createWriteStream(path);

    file.on("error", (err) => console.error(err));

    inp.pipe(file);

    inp.on("end", (err) => {
      const ret = {
        filename: name,
        headers: data.file.headers,
      };
      return JSON.stringify(ret);
    });
  }
  return res.response("File uploaded").code(200);
}

async function readZip(req, res) {
  const data = req.payload;
  // console.log(data);
  // console.log(data.file.path)

  try {
    const zip = new AdmZip(data.file.path);
    const outputDir = `${path.parse(data.file.path).name}_extracted`;
    zip.extractAllTo(outputDir);

    console.log(`Extracted to "${outputDir}" successfully`);

    return res.response("File unzipped").code(201);
  } catch (e) {
    console.log(`Something went wrong. ${e}`);
  }
}

// async function readZip(req, res) {
//   let actualName;
//   const data = req.payload;

//   //unzip file
//   if (data.file) {
//     const unzip = zlib.createUnzip();
//     const name = data.file.hapi.filename;
//     console.log(data.file._data);
//     let fileArr = name.split(".");
//     let filename = fileArr[0];
//     let fileExt = fileArr[1];
//     actualName = filename + "." + fileExt;
//     const path = __basedir + "/unZipFiles/" + name;
//     const inp = fs.createReadStream(data.file._data,'utf-8');
//     console.log(inp)
//     const out = fs.createWriteStream(path);
//     inp.pipe(unzip).pipe(out);
//   }

//   // //read file
//   // const readPath = __basedir + "/unZipFiles/" + actualName;
//   // console.log( __basedir + "/unZipFiles/" + actualName)
//   //   const readFile = fs.createReadStream("/unZipFiles/" + actualName,{encoding: 'utf8'} );

//   //   readFile.on("data",function (chunk) {
//   //     console.log('new chunk received');
//   //     console.log(chunk);

//   //   })

//   return res.response("File unzipped").code(201);
// }
