import React, { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { userServices } from "@/services/userServices";
import { useUserContext } from "@/context/UsersProvider";

function ProfilePage() {
  const { setProfile } = useUserContext();

  const [file, setFile] = useState(null);
  const [wallpaperFile, setWallpaperFile] = useState(null);

  const [preview, setPreview] = useState(null);
  const [wallpaperPreview, setWallpaperPreview] = useState(null);

  const [profileLoading, setProfileLoading] = useState(false);
  const [wallpaperLoading, setWallpaperLoading] = useState(false);

  // cleanup previews
  useEffect(() => {
    return () => {
      preview && URL.revokeObjectURL(preview);
      wallpaperPreview && URL.revokeObjectURL(wallpaperPreview);
    };
  }, [preview, wallpaperPreview]);

  const refreshProfile = async () => {
    const { data, success } = await userServices.getProfile();
    if (success) setProfile(data);
  };

  const handleProfileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  };

  const handleWallpaperChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setWallpaperFile(selected);
    setWallpaperPreview(URL.createObjectURL(selected));
  };

  const handleSaveProfile = async () => {
    if (!file) return;

    setProfileLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const { message, success } =
        await userServices.uploadProfilePicture(formData);

      if (success) {
        toast.success(message);
        await refreshProfile();
        setFile(null);
        setPreview(null);
      }
    } catch (err) {
      toast.error(err.message || "Failed to upload profile picture");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleSaveWallpaper = async () => {
    if (!wallpaperFile) return;

    setWallpaperLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", wallpaperFile);

      const { message, success } = await userServices.uploadWallpaper(formData);

      if (success) {
        toast.success(message);
        await refreshProfile();
        setWallpaperFile(null);
        setWallpaperPreview(null);
      }
    } catch (err) {
      toast.error(err.message || "Failed to upload wallpaper");
    } finally {
      setWallpaperLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 p-4">
      {/* Profile */}
      <div className="flex items-center justify-between">
        <span className="text-lg font-medium">Upload Profile Picture</span>
        <Button variant="outline" size="lg" className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleProfileChange}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          <Upload className="mr-2" />
          Upload
        </Button>
      </div>

      {preview && (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img
              src={preview}
              alt="Profile Preview"
              className="h-20 w-20 rounded-full object-cover border"
            />
            <div className="text-sm text-muted-foreground">
              <p>{file.name}</p>
              <p>{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
          </div>
          <Button
            onClick={handleSaveProfile}
            variant="outline"
            disabled={profileLoading}
          >
            {profileLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      )}

      {/* Wallpaper */}
      <div className="flex items-center justify-between">
        <span className="text-lg font-medium">Upload Wallpaper</span>
        <Button variant="outline" size="lg" className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleWallpaperChange}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          <Upload className="mr-2" />
          Upload
        </Button>
      </div>

      {wallpaperPreview && (
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img
              src={wallpaperPreview}
              alt="Wallpaper Preview"
              className="h-20 w-32 rounded-md object-cover border"
            />
            <div className="text-sm text-muted-foreground">
              <p>{wallpaperFile.name}</p>
              <p>{(wallpaperFile.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
          </div>
          <Button
            onClick={handleSaveWallpaper}
            variant="outline"
            disabled={wallpaperLoading}
          >
            {wallpaperLoading ? "Saving..." : "Save Wallpaper"}
          </Button>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
