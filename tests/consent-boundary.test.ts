import assert from "node:assert/strict";
import test from "node:test";

import {
  canParentViewHelpCard,
  sharedDecisionSummary,
} from "../src/lib/consent-boundary";

test("a parent cannot see a Help Card before student approval", () => {
  assert.equal(canParentViewHelpCard("private"), false);
  assert.match(sharedDecisionSummary("private"), /No action taken without approval/);
});

test("only approved Help Card states cross the family boundary", () => {
  assert.equal(canParentViewHelpCard("sent"), true);
  assert.equal(canParentViewHelpCard("accepted"), true);
  assert.match(sharedDecisionSummary("sent"), /approved Help Card/);
  assert.match(sharedDecisionSummary("accepted"), /No private chat was shared/);
});
