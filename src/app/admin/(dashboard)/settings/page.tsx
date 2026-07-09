import { getSiteSettings } from "@/lib/settings";
import { getResumeInfo, getProfileImageInfo } from "@/features/admin/actions";
import { SettingsForm } from "./settings-form";
import { ResumeUpload } from "@/components/shared/resume-upload";
import { ProfileImageUpload } from "@/components/shared/profile-image-upload";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const [settings, resume, profile] = await Promise.all([
    getSiteSettings(),
    getResumeInfo(),
    getProfileImageInfo(),
  ]);

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Site Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your portfolio configuration.
        </p>
      </div>

      <div className="glass rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Profile Image</h2>
        <ProfileImageUpload profile={profile} />
      </div>

      <div className="glass rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Resume</h2>
        <ResumeUpload resume={resume} />
      </div>

      <SettingsForm settings={settings} />
    </div>
  );
}
