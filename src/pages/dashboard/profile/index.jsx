import React, { useState } from "react";
import { useAuth } from "@/store/exports";
import { ProfileHeader, ProfileSidebar, ProfileTabs, ProfileComplexInfo, ProfileAdditionalInfo, ProfileEditModal } from "./components";
import { useProfileMessages } from "./hooks";

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const messages = useProfileMessages();
  const [editOpen, setEditOpen] = useState(false);

  return (
    <div className="space-y-5 pb-2" style={{ position: "relative", zIndex: 0 }}>
      <ProfileHeader />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-stretch">
        <div className="xl:col-span-4 h-full">
          <ProfileSidebar user={user} />
        </div>

        <div className="xl:col-span-8 h-full">
          <ProfileTabs user={user} messages={messages} onEditClick={() => setEditOpen(true)} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-stretch">
        <div className="xl:col-span-4 h-full">
          <ProfileComplexInfo user={user} />
        </div>
        <div className="xl:col-span-8 h-full">
          <ProfileAdditionalInfo user={user} />
        </div>
      </div>

      <ProfileEditModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        user={user}
        onSaved={refreshUser}
        messages={messages}
      />
    </div>
  );
};

export default Profile;
