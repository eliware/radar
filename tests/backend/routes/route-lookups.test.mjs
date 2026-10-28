import { expect, jest, test } from "@jest/globals";
import { registerRouteLookupControl } from "../../../src/backend/routes/route-lookups.mjs";

function register(feed) {
  let handler;
  registerRouteLookupControl(
    {
      post: (path, route) => {
        expect(path).toBe("/api/route-lookups");
        handler = route;
      },
    },
    feed,
  );
  return handler;
}

function makeReply() {
  return {
    code: jest.fn(function (status) {
      this.status = status;
      return this;
    }),
    send: jest.fn(function (body) {
      this.body = body;
      return this;
    }),
  };
}

test("validates and forwards the route lookup setting", async () => {
  const setRouteLookupsEnabled = jest.fn();
  const handler = register({ setRouteLookupsEnabled });
  expect(await handler({ body: { enabled: false } }, {})).toEqual({ enabled: false });
  expect(setRouteLookupsEnabled).toHaveBeenCalledWith(false);
  const reply = makeReply();
  await handler({ body: { enabled: "false" } }, reply);
  expect(reply.status).toBe(400);
  expect(reply.body).toEqual({ error: "enabled must be a boolean." });
});

test("reports unavailable route lookup controls", async () => {
  const reply = makeReply();
  await register({})({ body: { enabled: true } }, reply);
  expect(reply.status).toBe(501);
  expect(reply.body).toEqual({ error: "Route lookups are not available." });
});
