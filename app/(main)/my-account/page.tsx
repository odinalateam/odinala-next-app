import { redirect } from "next/navigation";
import { getProfile } from "@/lib/actions/profile";
import { ProfileClient } from "@/components/account/profile-client";
import IOSInstallPrompt from "@/components/notifications/ios-install-prompt";
import PushPermissionPrompt from "@/components/notifications/push-permission-prompt";

export default async function ProfilePage() {
  let data;
  try {
    data = await getProfile();
  } catch {
    redirect("/auth/sign-in");
  }

  const { user, profile } = data;

  return (
    <>
      <IOSInstallPrompt />
      <PushPermissionPrompt />
      <ProfileClient user={user} profile={profile} />
    </>
  );
}
