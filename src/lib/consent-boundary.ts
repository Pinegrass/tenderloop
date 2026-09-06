export type HelpCardStatus = "private" | "sent" | "accepted";

export function canParentViewHelpCard(status: HelpCardStatus) {
  return status === "sent" || status === "accepted";
}

export function sharedDecisionSummary(status: HelpCardStatus) {
  if (status === "accepted") {
    return "Daniel confirmed Maya’s approved Help Card for 7:30 PM. No private chat was shared.";
  }

  if (status === "sent") {
    return "Maya shared one approved Help Card with Daniel. Her study conversation remains private.";
  }

  return "Drafted a plan from Maya’s assignment and family calendar. No action taken without approval.";
}
