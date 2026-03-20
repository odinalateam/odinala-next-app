import { getProfile } from "@/lib/actions/profile";
import { ProfileClient } from "@/components/account/profile-client";

export default async function ProfilePage() {
  const { user, profile } = await getProfile();

  return <ProfileClient user={user} profile={profile} />;
}
