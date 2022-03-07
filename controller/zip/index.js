const fs = require("fs");
const zlib = require("zlib");
const homedir = require("os").homedir();
const StreamZip = require("node-stream-zip");
var unzipper = require('unzipper');

module.exports = {
  createZip,
  uploadZip,
  readZip,
};

async function createZip(req, res) {
  const data = req.payload;
  if (data.file) {
    const gzip = zlib.createGzip();
    const name = data.file.filename;
    const path = __basedir + "/ZipFiles/" + name;
    const inp = fs.createReadStream(data.file.path);
    const out = fs.createWriteStream(path + ".zip");
    inp.pipe(gzip).pipe(out);

    return res.response("File zipped").code(201);
  }
}

async function uploadZip(req, res) {
  const data = req.payload;

  if (data.file) {
    const name = data.file.filename;
    let fileArr = name.split(".");
    let filename = fileArr[0];
    let fileExt = fileArr[1];
    if (fileExt !== "jpg") {
      return res.response("something went wrong").code(400);
    }
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
  let actualName;
  const data = req.payload;

  //unzip file
  if (data.file) {
    const unzip = zlib.createUnzip();
    const name = data.file.filename;
    let fileArr = name.split(".");
    let filename = fileArr[0];
    let fileExt = fileArr[1];
    actualName = filename + "." + fileExt
    const path = __basedir + "/unZipFiles/" + actualName;
    const inp = fs.createReadStream(data.file.path);
    const out = fs.createWriteStream(path);
    inp.pipe(unzip).pipe(out);
  }

  // //read file
  // const readPath = __basedir + "/unZipFiles/" + actualName;
  // console.log( __basedir + "/unZipFiles/" + actualName)
  //   const readFile = fs.createReadStream("/unZipFiles/" + actualName,{encoding: 'utf8'} );
    
  //   readFile.on("data",function (chunk) { 
  //     console.log('new chunk received');
  //     console.log(chunk);
     
  //   })

    return res.response("File unzipped").code(201);
}