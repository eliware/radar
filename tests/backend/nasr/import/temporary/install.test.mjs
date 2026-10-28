import { expect, jest, test } from "@jest/globals";
import { installNasrTemporaryCopy } from "../../../../../src/backend/nasr/import/temporary/install.mjs";

function createFiles() {
  return {
    copy: jest.fn(),
    mkdir: jest.fn(),
    rename: jest.fn(),
    remove: jest.fn(),
  };
}

test("prepares a temporary copy before installing it atomically", () => {
  const files = createFiles();
  expect(installNasrTemporaryCopy(files, "source.sqlite", "/tmp/NASR.sqlite", () => 4)).toBe(4);
  expect(files.mkdir).toHaveBeenCalledWith("/tmp", { recursive: true });
  expect(files.copy).toHaveBeenCalledWith("source.sqlite", expect.stringContaining(".tmp-"));
  expect(files.rename).toHaveBeenCalledWith(expect.stringContaining(".tmp-"), "/tmp/NASR.sqlite");
  expect(files.remove).not.toHaveBeenCalled();
});

test("removes the temporary copy if preparation fails", () => {
  const files = createFiles();
  expect(() =>
    installNasrTemporaryCopy(files, "source.sqlite", "/tmp/NASR.sqlite", () => {
      throw new Error("prepare failed");
    }),
  ).toThrow("prepare failed");
  expect(files.remove).toHaveBeenCalledWith(expect.stringContaining(".tmp-"), { force: true });
});
