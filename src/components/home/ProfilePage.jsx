import React, { useState } from "react";
import { Upload } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { userServices } from "@/services/userServices";
import { useUserContext } from "@/context/UsersProvider";

function ProfilePage() {
  const { setProfile } = useUserContext();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleSave = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const { message, success } = await userServices.uploadProfilePicture(
        formData
      );
      if (success) {
        toast.success(message);
        const { data, success } = await userServices.getProfile();
        if (success) {
          setProfile(data);
        }
      }
    } catch (error) {
      toast.success(error.message);
    } finally {
      setLoading(false);
    }
  };
  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  };
  return (
    <div className="w-full flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <span className="text-lg font-medium">Upload Profile Picture</span>

        <Button variant="outline" size="lg" className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
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
              alt="Preview"
              className="h-20 w-20 rounded-full object-cover border"
            />
            <div className="text-sm text-muted-foreground">
              <p>{file.name}</p>
              <p>{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
          </div>
          <div>
            <Button
              onClick={handleSave}
              variant="outline"
              disabled={loading}
              className="relative text-chart-2 "
            >
              {loading ? <>Saving...</> : <>Save</>}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProfilePage;
