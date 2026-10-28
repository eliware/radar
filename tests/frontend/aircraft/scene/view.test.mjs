import { expect, jest, test } from "@jest/globals";
import { createAircraftSceneView } from "../../../../src/frontend/aircraft/scene/view.mjs";

test("composes scene services into the public view API", () => {
  const items = [{ id: "airport" }];
  const updateAirspace = jest.fn();
  const updates = jest.fn((callback) => ({ updateAirports: callback }));
  const destroy = jest.fn();
  const workflow = { update: jest.fn(), updateRemote: jest.fn(), updateSnapshot: jest.fn() };
  const connection = { setConnected: jest.fn() };
  const layers = { aircraft: { isLocalOnly: jest.fn() }, ils: { setVisible: jest.fn() } };
  const viewport = { visibleRadiusNm: jest.fn() };
  const orbit = { onViewChange: jest.fn() };
  const radar = { reset: jest.fn() };
  const view = createAircraftSceneView({
    connection,
    workflow,
    layers,
    references: { updates },
    updateAirspace,
    viewport,
    orbit,
    radar,
    destroy,
  });

  expect(view).toMatchObject({
    ...connection,
    update: workflow.update,
    updateRemote: workflow.updateRemote,
    updateSnapshot: workflow.updateSnapshot,
    isLocalOnly: layers.aircraft.isLocalOnly,
    setIlsVisible: layers.ils.setVisible,
    ...viewport,
    ...orbit,
    reset: radar.reset,
    destroy,
  });
  view.updateAirports(items);
  expect(updates).toHaveBeenCalledWith(updateAirspace);
  expect(updateAirspace).toHaveBeenCalledWith(items);
  view.destroy();
  expect(destroy).toHaveBeenCalledTimes(1);
});
