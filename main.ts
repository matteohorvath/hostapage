import express, { Router } from "express";
import vhost from "vhost";
import multer from "multer";
import { open } from "sqlite";
import sqlite3 from "sqlite3";
import FileController, { fileType } from "./FileController";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "files/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
var upload = multer({ storage: storage });
/*{
  files: {
    file1: "content1",
    file2: "content2",
    file3: "content3",
  },
}; */

const app = express();
const fileController = new FileController();
const files: fileType[] = await fileController.getFiles();

const port = 3000;

const router = Router();
router.get("/", (req, res) => {
  res.send("Hello, World!");
});

router.get("/files", async (req, res) => {
  res.send(files);
});
router.get("/files/add", async (req, res) => {
  res.sendFile(__dirname + "/htmls/new_file.html");
});

router.post("/files/add", upload.single("file"), async (req, res) => {
  const upload = await fileController.addFile({
    id: undefined,
    name: req.file.originalname,
    subdomain: req.body.subdomain,
    filename: req.file.filename,
  });
  res.send("Thanks for uploading the file!");
});
app.use(vhost("localhost", router));

Object.keys(files).forEach((k) => {
  const _router = Router();
  _router.get("/", (req, res) => {
    res.sendFile(__dirname + "/files/" + files[k].filename);
  });
  app.use(vhost(`${files[k].subdomain}.localhost`, _router));
});

app.listen(port);
