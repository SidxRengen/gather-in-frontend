import { groupServices } from "@/services/groupServices";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { toast } from "sonner";
import { Button } from "../ui/button";

const animatedComponents = makeAnimated();

const darkSelectStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: "#0f172a",
    borderColor: state.isFocused ? "#38bdf8" : "#334155",
    boxShadow: "none",
    "&:hover": {
      borderColor: "#38bdf8",
    },
  }),

  menu: (base) => ({
    ...base,
    backgroundColor: "#020617",
  }),

  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? "#1e293b" : "#020617",
    color: "#e5e7eb",
    cursor: "pointer",
  }),

  multiValue: (base) => ({
    ...base,
    backgroundColor: "#1e293b",
  }),

  multiValueLabel: (base) => ({
    ...base,
    color: "#e5e7eb",
  }),

  multiValueRemove: (base) => ({
    ...base,
    color: "#94a3b8",
    ":hover": {
      backgroundColor: "#ef4444",
      color: "white",
    },
  }),

  input: (base) => ({
    ...base,
    color: "#e5e7eb",
  }),

  singleValue: (base) => ({
    ...base,
    color: "#e5e7eb",
  }),

  placeholder: (base) => ({
    ...base,
    color: "#94a3b8",
  }),
};

function GroupSettings({ groupInfo, allActiveUsers, setActiveTab }) {
  const [options, setOptions] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!groupInfo?.members || !allActiveUsers) return;

    const existingMembers = groupInfo.members.map((m) => ({
      label: m.userName,
      value: m.email,
    }));

    setSelectedMembers(existingMembers);

    const memberEmailSet = new Set(existingMembers.map((m) => m.value));

    const availableUsers = allActiveUsers
      .filter((u) => !memberEmailSet.has(u.email))
      .map((u) => ({
        label: u.userName,
        value: u.email,
      }));

    setOptions(availableUsers);
  }, [groupInfo, allActiveUsers]);
  console.log("options", options);
  console.log("selectedMembers", selectedMembers);
  const handleAddMembers = async () => {
    if (selectedMembers.length === 0) {
      toast.error("Please select at least one member");
      return;
    }

    const payload = {
      members: selectedMembers.map((m) => m.value),
    };

    try {
      setLoading(true);
      await groupServices?.addGroupMembers(groupInfo?.id, payload);

      toast.success("Members Updated successfully");
      setActiveTab("home");
      setSelectedMembers([]);
      const addedEmails = new Set(selectedMembers.map((m) => m.value));

      setOptions((prevOptions) =>
        prevOptions.filter((option) => !addedEmails.has(option.value))
      );
    } catch (error) {
      toast.error("Failed to add members");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="text-lg flex  justify-between">
        <div className="flex justify-between items-center">
          <span className="text-lg font-medium">Add Members:</span>
        </div>

        <div className="w-1/2">
          <Select
            isMulti
            components={animatedComponents}
            options={options}
            value={Array.isArray(selectedMembers) ? selectedMembers : []}
            onChange={(value) => setSelectedMembers(value || [])}
            placeholder="Select group members"
            styles={darkSelectStyles}
            theme={(theme) => ({
              ...theme,
              borderRadius: 8,
              colors: {
                ...theme.colors,
                primary25: "#1e293b",
                primary: "#38bdf8",
              },
            })}
          />
        </div>
      </div>
      <div className="flex gap-4 justify-end">
        <Button
          onClick={handleAddMembers}
          disabled={loading}
          variant="outline"
          className="relative text-chart-2 text-lg"
        >
          {loading ? <>Updating Members...</> : <>Update Members</>}
        </Button>
        <Button
          onClick={() => setActiveTab("home")}
          disabled={loading}
          variant="outline"
          className="relative text-chart-5 text-lg"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default GroupSettings;
