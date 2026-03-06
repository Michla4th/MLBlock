import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

type Props = {
  selectedValue?: string;
  onValueChange?: (value: string) => void;
};

const BUTTON_WIDTH = 100; 

const StatusDropdown: React.FC<Props> = ({ selectedValue = "Online", onValueChange }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string>(selectedValue);

  const options = ["Online", "Offline"];

  return (
    <View style={{ alignItems: "center" }}>
      {open && (
        <View
          style={{
            position: "absolute",
            bottom: 45, 
            alignItems: "center",
            zIndex: 10,
          }}
        >
          {/* Danh sách lựa chọn */}
          <View
            style={{
              backgroundColor: "#373C4C",
              borderRadius: 15,
              overflow: "hidden",
              width: BUTTON_WIDTH,
            }}
          >
            {options.map((opt) => (
              <TouchableOpacity
                key={opt}
                onPress={() => {
                  setSelected(opt);
                  onValueChange?.(opt);
                  setOpen(false);
                }}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 20,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: "#fff",
                    opacity: opt === selected ? 1 : 0.7,
                    fontWeight: opt === selected ? "bold" : "normal",
                  }}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Mũi tên chỉ lên (đã đổi thành borderTopWidth) */}
          <View
            style={{
              width: 0,
              height: 0,
              borderLeftWidth: 10,
              borderRightWidth: 10,
              borderTopWidth: 10,
              borderStyle: "solid",
              backgroundColor: "transparent",
              borderLeftColor: "transparent",
              borderRightColor: "transparent",
              borderTopColor: "#373C4C",
              marginTop: 0, 
            }}
          />
        </View>
      )}

      {/* === NÚT CHÍNH (Phần duy nhất trong layout) === */}
      <TouchableOpacity
        onPress={() => setOpen(!open)}
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#373C4C",
          paddingVertical: 10,
          paddingHorizontal: 20,
          borderRadius: 20,
          marginTop: 5,
          width: BUTTON_WIDTH,
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold", marginRight: 6 }}>
          {selected}
        </Text>
        <MaterialIcons
          name={open ? "keyboard-arrow-down" : "keyboard-arrow-up"}
          size={20}
          color="#fff"
        />
      </TouchableOpacity>
    </View>
  );
};

export default StatusDropdown;