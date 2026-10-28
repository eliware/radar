export function conditionText(conditions) {
  return conditions.length
    ? conditions
        .map(
          ({ intensity = "", descriptive = "", phenomenons }) =>
            `${intensity}${descriptive}${phenomenons.join("")}`,
        )
        .join(" ")
    : "—";
}
