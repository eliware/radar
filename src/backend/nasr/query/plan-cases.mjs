import { ARTCC_POINTS } from "../../artcc-boundary-query.mjs";
import { AIRWAY_QUERY } from "../../airway/query-rules.mjs";
import { ILS_APPROACH_QUERY, ILS_MARKER_QUERY } from "../../ils/approach/query.mjs";
import { SID_QUERY, STAR_QUERY } from "../../procedure/query-rules.mjs";
import { RUNWAY_QUERY } from "../../airport/runway/query.mjs";
import { AIRPORT_QUERY, NAVAID_QUERY } from "../../sql-query-rules.mjs";

export const NASR_QUERY_PLAN_CASES = [
  [
    "airports",
    AIRPORT_QUERY,
    [43, 44, -71, -70],
    ["radar_apt_location", "radar_runway_filter", "radar_airspace_apt"],
  ],
  ["runways", RUNWAY_QUERY, ['["PWM","BID"]'], ["radar_runway_filter", "radar_runway_end"]],
  ["navaids", NAVAID_QUERY, [43, 44, -71, -70], ["radar_navaid_location"]],
  [
    "airways",
    AIRWAY_QUERY,
    [],
    ["radar_airway_current", "radar_fix_current_join", "radar_navaid_join"],
  ],
  [
    "SIDs",
    SID_QUERY,
    [],
    ["radar_dp_code", "radar_dp_route", "radar_fix_procedure_join", "radar_navaid_procedure_join"],
  ],
  [
    "STARs",
    STAR_QUERY,
    [],
    [
      "radar_star_code",
      "radar_star_route",
      "radar_fix_procedure_join",
      "radar_navaid_procedure_join",
    ],
  ],
  ["ILS approaches", ILS_APPROACH_QUERY, [43, 44, -71, -70], ["radar_ils_glideslope"]],
  ["ILS markers", ILS_MARKER_QUERY, [43, 44, -71, -70], ["radar_ils_marker_location"]],
  ["ARTCC boundaries", ARTCC_POINTS, [], ["radar_artcc_order"]],
];
