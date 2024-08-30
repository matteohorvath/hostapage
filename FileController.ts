import { Database } from "sqlite";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();
export type fileType = {
  id: string | undefined;
  name: string;
  subdomain: string;
  filename: string;
};

class FileController {
  async getFiles() {
    const res = await prisma.file.findMany();
    return res;
  }
  async addFile(file: fileType) {
    const res = await prisma.file.create({
      data: file,
    });
    return res;
  }
  async getFile(subdomain: string) {
    const res = await prisma.file.findMany({
      where: {
        subdomain: subdomain,
      },
      take: 1,
    });
    return res[0];
  }
}

export default FileController;
