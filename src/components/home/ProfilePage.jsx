import React, { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { userServices } from "@/services/userServices";
import { useUserContext } from "@/context/UsersProvider";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { cn } from "@/lib/utils";

function ProfilePage() {
  const { profile, setProfile } = useUserContext();
  const [profileSettings, setProfileSettings] = useState({
    opacity: profile?.opacity,
    blur: profile?.blur,
  });
  const [file, setFile] = useState(null);
  const [wallpaperFile, setWallpaperFile] = useState(null);

  const [preview, setPreview] = useState(null);
  const [wallpaperPreview, setWallpaperPreview] = useState(null);
  const MAX_SIZE = 4 * 1024 * 1024;
  const [profileLoading, setProfileLoading] = useState(false);
  const [wallpaperLoading, setWallpaperLoading] = useState(false);

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
    if (selected.size > MAX_SIZE) {
      toast.error("File size must be less than 4MB");
      e.target.value = "";
      return;
    }
    setWallpaperFile(selected);
    setWallpaperPreview(URL.createObjectURL(selected));
  };

  const handleSaveProfile = async () => {
    if (profileLoading || !preview) return;

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
  const handleSettingsChange = (key, value) => {
    setProfileSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSaveProfileSettings = async () => {
    try {
      const { success, message } =
        await userServices.updateProfileSettings(profileSettings);

      if (success) {
        toast.success(message || "Profile settings updated");
        await refreshProfile();
      }
    } catch (err) {
      toast.error(err.message || "Failed to update settings");
    }
  };
  const blurMap = {
    none: "",
    xs: "blur-xs",
    sm: "blur-sm",
    md: "blur-md",
    lg: "blur-lg",
  };
  return (
    <div className="w-full flex flex-col gap-8 px-3 md:px-6 py-4">
      <div className="flex items-center justify-between">
        <span className="text-base md:text-lg font-semibold">
          Upload Profile Picture
        </span>
        <Button
          variant="outline"
          size="lg"
          className="relative px-6 active:scale-[0.98] transition"
        >
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={preview}
              alt="Profile Preview"
              className="h-20 w-20 rounded-full object-cover border"
            />
            <div className="text-xs md:text-sm text-muted-foreground leading-tight">
              <p>{file.name}</p>
              <p>{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
          </div>
          <Button
            onClick={handleSaveProfile}
            variant="outline"
            className="px-6 self-start md:self-auto"
          >
            {profileLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      )}

      <div className="flex items-center justify-between">
        <span className="text-base md:text-lg font-semibold">
          Upload Wallpaper
        </span>
        <Button
          variant="outline"
          size="lg"
          className="relative px-6 active:scale-[0.98] transition"
        >
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={wallpaperPreview}
              alt="Wallpaper Preview"
              className="h-20 w-32 rounded-md object-cover border"
            />
            <div className="text-xs md:text-sm text-muted-foreground leading-tight">
              <p>{wallpaperFile.name}</p>
              <p>{(wallpaperFile.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
          </div>
          <Button
            onClick={handleSaveWallpaper}
            variant="outline"
            className="px-6 self-start md:self-auto"
          >
            {wallpaperLoading ? "Saving..." : "Save Wallpaper"}
          </Button>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <span className="text-lg font-medium">Opacity (0-100)</span>

        <Input
          type="number"
          min={0}
          max={100}
          value={profileSettings.opacity}
          onChange={(e) =>
            handleSettingsChange("opacity", Number(e.target.value))
          }
          className="w-full md:w-1/4"
        />
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <span className="text-lg font-medium">Blur</span>

        <Select
          value={profileSettings.blur}
          onValueChange={(value) => handleSettingsChange("blur", value)}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select Blur Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="xs">Extra Small</SelectItem>
              <SelectItem value="sm">Small</SelectItem>
              <SelectItem value="md">Medium</SelectItem>
              <SelectItem value="lg">Large</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="mb-2 text-sm text-muted-foreground">
          Live Preview (Upload Wallpaper first)
        </p>
        <div
          className={cn(
            "h-36 w-full rounded-lg bg-cover bg-center transition-all",
            blurMap[profileSettings.blur],
          )}
          style={{
            backgroundImage: `url(${wallpaperPreview || ""})`,
            opacity: profileSettings.opacity / 100,
          }}
        />
      </div>
      <Button
        onClick={handleSaveProfileSettings}
        className="self-stretch md:self-end px-8"
      >
        Save Profile Settings
      </Button>
    </div>
  );
}

export default ProfilePage;
