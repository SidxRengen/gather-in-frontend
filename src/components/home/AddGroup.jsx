import { Image, Upload } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "../ui/input-group";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { groupServices } from "@/services/groupServices";

function AddGroup({ setActiveTab, setAllActiveGroups }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [groupData, setGroupData] = useState({
    name: "",
    description: "",
  });
  const handleChange = (e) => {
    if (e.target.name === "profileImage") {
      const selectedFile = e.target.files[0];
      if (!selectedFile) return;
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      return;
    }
    if (e.target.name === "description" && e.target.value.length > 120) {
      toast("description can not exceed 120 characters");
      return;
    }
    setGroupData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const navigate = useNavigate();
  const handleSave = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append(
      "data",
      new Blob([JSON.stringify(groupData)], { type: "application/json" })
    );

    if (file) {
      formData.append("file", file);
    }

    try {
      const { message, data, success } = await groupServices.addGroup(formData);
      if (success) {
        toast.success(message);
        setAllActiveGroups((prev) => [
          ...prev,
          {
            userName: groupData.name,
            photo: data.photoUrl,
            timestamp: data.timestamp,
            email: data.id,
          },
        ]);
        setActiveTab("home");
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full flex flex-col  gap-4 p-4">
      <div className="flex items-center w-full justify-between">
        <span className="text-lg   w-1/2 font-medium">Name</span>

        <InputGroup className="w-[30%]">
          <InputGroupInput
            name="name"
            value={groupData?.name}
            onChange={handleChange}
            type="text"
            placeholder="Enter group name"
          />
        </InputGroup>
      </div>
      <div className="flex items-center w-full justify-between">
        <span className="text-lg   w-1/2 font-medium">Description</span>

        <InputGroup className="w-[30%]">
          <InputGroupTextarea
            name="description"
            value={groupData?.description}
            onChange={handleChange}
            placeholder="Enter description"
          />
          <InputGroupAddon align="block-end">
            <InputGroupText className="text-muted-foreground text-xs">
              {120 - groupData.description.length} characters left
            </InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div className="flex w-full justify-between">
        <span className="text-lg  font-medium">Upload Group Picture</span>

        <Button variant="outline" size="lg" className="relative ">
          <input
            type="file"
            name="profileImage"
            accept="image/*"
            onChange={handleChange}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          <Upload className="mr-2" />
          Upload
        </Button>
      </div>
      <div className="flex justify-between items-center">
        <div>
          {preview && (
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
          )}
        </div>
        <div>
          <Button
            onClick={handleSave}
            variant="outline"
            disabled={
              groupData.name === "" || groupData.description === "" || loading
            }
            className="relative disabled:text-gray-500 text-chart-2 "
          >
            {loading ? <>Saving...</> : <>Save</>}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AddGroup;
