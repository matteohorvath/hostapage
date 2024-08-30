import express, { Router } from "express";
import vhost from "vhost";
import multer from "multer";
import { open } from "sqlite";
import sqlite3 from "sqlite3";
import FileController, { fileType } from "./FileController";

import dotenv from "dotenv";
dotenv.config();
const domain = process.env.DOMAIN;

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
app.use(vhost(domain, router));

const _router = Router();
_router.get("/", async (req, res) => {
  const file: fileType = await fileController.getFile(req.vhost[0]);
  res.sendFile(__dirname + "/files/" + file.filename);
});
_router.get("/test", async (req, res) => {
  const file: fileType = await fileController.getFile(req.vhost[0]);
  res.send("This is a test page for " + file.name);
});
app.use(vhost(`*.${domain}`, _router));

app.listen(port);
