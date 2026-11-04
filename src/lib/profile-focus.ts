import type { Profile } from "@/types/resume";

export interface ProfileFocusState {
  hovered: boolean;
  focused: boolean;
  pinned: boolean;
}
export type ProfileFocusAction =
  | { type: "hover"; value: boolean }
  | { type: "focus"; value: boolean }
  | { type: "toggle" }
  | { type: "close" };

export const closedProfile: ProfileFocusState = {
  hovered: false,
  focused: false,
  pinned: false,
};

export function profileIsOpen(state: ProfileFocusState): boolean {
  return state.hovered || state.focused || state.pinned;
}

export function profileFocusReducer(
  state: ProfileFocusState,
  action: ProfileFocusAction,
): ProfileFocusState {
  switch (action.type) {
    case "hover":
      return { ...state, hovered: action.value };
    case "focus":
      return { ...state, focused: action.value };
    case "toggle":
      return state.pinned ? closedProfile : { ...state, pinned: true };
    case "close":
      return closedProfile;
  }
}

export function profileBiography(profile: Profile): string {
  return (
    profile.biography?.trim() ||
    profile.shortSummary?.trim() ||
    profile.headline
  );
}
