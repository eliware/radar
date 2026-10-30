import { requestAdsbLolCircle } from "../request/circle.mjs";

export async function requestAndApplyAdsbLolCircle({
  request,
  location,
  radiusNm,
  isCurrent,
  aircraft,
  publish,
  onRequest = () => {},
}) {
  const records = await requestAdsbLolCircle(request, location, radiusNm, undefined, onRequest);
  if (!isCurrent()) return;
  records.forEach((item) => aircraft.update(item));
  publish();
}
