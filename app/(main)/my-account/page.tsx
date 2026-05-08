import { getProfile } from "@/lib/actions/profile";
import { ProfileClient } from "@/components/account/profile-client";
import IOSInstallPrompt from "@/components/notifications/ios-install-prompt";
import PushPermissionPrompt from "@/components/notifications/push-permission-prompt";

export default async function ProfilePage() {
  const { user, profile } = await getProfile();

  return (
    <>
      <IOSInstallPrompt />
      <PushPermissionPrompt />
      <ProfileClient user={user} profile={profile} />
    </>
  );
}
