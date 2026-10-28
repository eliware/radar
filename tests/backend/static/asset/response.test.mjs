import { expect, jest, test } from "@jest/globals";
import { sendStaticAsset } from "../../../../src/backend/static/asset/response.mjs";

function reply() {
  const value = {
    code: jest.fn(),
    type: jest.fn(),
    send: jest.fn(),
  };
  value.code.mockReturnValue(value);
  value.type.mockReturnValue(value);
  value.send.mockReturnValue(value);
  return value;
}

test("reads and sends an asset with its content type", async () => {
  const response = reply();
  const read = jest.fn(async () => Buffer.from("asset"));

  await sendStaticAsset(response, "public/index.html", "text/html", read);

  expect(read).toHaveBeenCalledWith("public/index.html");
  expect(response.type).toHaveBeenCalledWith("text/html; charset=utf-8");
  expect(response.send).toHaveBeenCalledWith(Buffer.from("asset"));
  expect(response.code).not.toHaveBeenCalled();
});

test("uses the filesystem reader by default", async () => {
  const response = reply();

  await sendStaticAsset(response, "package.json", "application/json");

  expect(response.type).toHaveBeenCalledWith("application/json; charset=utf-8");
  expect(response.send.mock.calls[0][0].toString()).toContain('"name": "@eliware/radar"');
});

test("returns a plain text 404 when reading an asset fails", async () => {
  const response = reply();
  const read = jest.fn().mockRejectedValue(new Error("missing"));

  await sendStaticAsset(response, "dist/missing.js", "text/javascript", read);

  expect(response.code).toHaveBeenCalledWith(404);
  expect(response.type).toHaveBeenCalledWith("text/plain; charset=utf-8");
  expect(response.send).toHaveBeenCalledWith("Not found");
});
