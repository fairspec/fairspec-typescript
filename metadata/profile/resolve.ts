import { loadProfile } from "./load.ts"
import type { Profile } from "./Profile.ts"

export async function resolveProfile(profile: Profile | string) {
  if (typeof profile !== "string") {
    return profile
  }

  return await loadProfile(profile)
}
