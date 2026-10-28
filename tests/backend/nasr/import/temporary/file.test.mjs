import { expect, jest, test } from "@jest/globals";
import { createNasrImportTemporaryFile } from "../../../../../src/backend/nasr/import/temporary/file.mjs";

test("applies path and filesystem policy to temporary import files", () => {
  const files = {
    copy: jest.fn(),
    mkdir: jest.fn(),
    rename: jest.fn(),
    remove: jest.fn(),
  };
  const temporaryFile = createNasrImportTemporaryFile(files);
  const temporary = temporaryFile.temporaryPath("/tmp/nasr.sqlite");

  temporaryFile.prepareOutput("/tmp/nasr.sqlite");
  temporaryFile.copyInput("source.sqlite", temporary);
  temporaryFile.install(temporary, "/tmp/nasr.sqlite");

  expect(files.mkdir).toHaveBeenCalledWith("/tmp", { recursive: true });
  expect(files.copy).toHaveBeenCalledWith("source.sqlite", temporary);
  expect(files.rename).toHaveBeenCalledWith(temporary, "/tmp/nasr.sqlite");
});
