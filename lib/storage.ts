import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), ".data");

async function ensureDataDir(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // Directory exists
  }
}

export interface StorageAdapter<T> {
  getAll(): Promise<T[]>;
  getById(id: string): Promise<T | undefined>;
  create(item: T): Promise<T>;
  update(id: string, item: Partial<T>): Promise<T | undefined>;
  delete(id: string): Promise<boolean>;
}

export function createFileStorage<T extends { id: string }>(
  collection: string
): StorageAdapter<T> {
  const filePath = path.join(DATA_DIR, `${collection}.json`);

  async function readData(): Promise<T[]> {
    await ensureDataDir();
    try {
      const raw = await fs.readFile(filePath, "utf-8");
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  async function writeData(data: T[]): Promise<void> {
    await ensureDataDir();
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  }

  return {
    async getAll() {
      return readData();
    },
    async getById(id: string) {
      const data = await readData();
      return data.find((item) => item.id === id);
    },
    async create(item: T) {
      const data = await readData();
      data.push(item);
      await writeData(data);
      return item;
    },
    async update(id: string, partial: Partial<T>) {
      const data = await readData();
      const index = data.findIndex((item) => item.id === id);
      if (index === -1) return undefined;
      data[index] = { ...data[index], ...partial };
      await writeData(data);
      return data[index];
    },
    async delete(id: string) {
      const data = await readData();
      const filtered = data.filter((item) => item.id !== id);
      if (filtered.length === data.length) return false;
      await writeData(filtered);
      return true;
    },
  };
}

export async function saveFile(
  filename: string,
  buffer: Buffer
): Promise<string> {
  const uploadsDir = path.join(DATA_DIR, "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });
  const safeName = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
  const filePath = path.join(uploadsDir, safeName);
  await fs.writeFile(filePath, buffer);
  return safeName;
}
