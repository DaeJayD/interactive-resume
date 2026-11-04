import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { ProfileSection } from "../src/components/resume/ProfileSection";
import {
  closedProfile,
  profileBiography,
  profileFocusReducer,
  profileIsOpen,
} from "../src/lib/profile-focus";

test("hover and focus coexist so leaving the pointer does not close keyboard content", () => {
  let state = profileFocusReducer(closedProfile, {
    type: "hover",
    value: true,
  });
  state = profileFocusReducer(state, { type: "focus", value: true });
  state = profileFocusReducer(state, { type: "hover", value: false });
  assert.equal(profileIsOpen(state), true);
  state = profileFocusReducer(state, { type: "focus", value: false });
  assert.equal(profileIsOpen(state), false);
});
test("click pins a focused or hovered panel; repeat click and explicit close dismiss it", () => {
  let state = profileFocusReducer(
    { ...closedProfile, focused: true },
    { type: "toggle" },
  );
  state = profileFocusReducer(state, { type: "focus", value: false });
  assert.equal(profileIsOpen(state), true);
  assert.equal(
    profileIsOpen(profileFocusReducer(state, { type: "toggle" })),
    false,
  );
  assert.deepEqual(
    profileFocusReducer(
      { hovered: true, focused: true, pinned: true },
      { type: "close" },
    ),
    closedProfile,
  );
});
test("missing biography uses meaningful existing content", () => {
  const profile = {
    id: "writer",
    fullName: "Example Writer",
    headline: "Editor",
  };
  assert.equal(profileBiography(profile), "Editor");
  assert.equal(
    profileBiography({
      ...profile,
      shortSummary: "Writes essays.",
      biography: "  ",
    }),
    "Writes essays.",
  );
  const html = renderToStaticMarkup(<ProfileSection profile={profile} />);
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, /inert=""/);
  assert.doesNotMatch(html, /undefined|<img|<nav/);
});
test("invalid profile links are omitted while configured image alt text is preserved", () => {
  const html = renderToStaticMarkup(
    <ProfileSection
      profile={{
        id: "writer",
        fullName: "Example Writer",
        headline: "Editor",
        image: { src: "/portrait.jpg", alt: "Portrait of the editor" },
        socialLinks: [
          { id: "bad", label: "Unsafe link", url: "javascript:alert(1)" },
        ],
      }}
    />,
  );
  assert.match(html, /alt="Portrait of the editor"/);
  assert.doesNotMatch(html, /Unsafe link|javascript:/);
});
