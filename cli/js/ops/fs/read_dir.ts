// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

import { sendSync, sendAsync } from "../dispatch_json.ts";
import { pathFromURL } from "../../util.ts";

export interface DirEntry {
  name: string;
  isFile: boolean;
  isDirectory: boolean;
  isSymlink: boolean;
}

interface ReadDirResponse {
  entries: DirEntry[];
}

function res(response: ReadDirResponse): DirEntry[] {
  return response.entries;
}

export function readDirSync(path: string | URL): Iterable<DirEntry> {
  return res(sendSync("op_read_dir", { path: pathFromURL(path) }))[
    Symbol.iterator
  ]();
}

export function readDir(path: string | URL): AsyncIterable<DirEntry> {
  const array = sendAsync("op_read_dir", { path: pathFromURL(path) }).then(res);
  return {
    async *[Symbol.asyncIterator](): AsyncIterableIterator<DirEntry> {
      yield* await array;
    },
  };
}
