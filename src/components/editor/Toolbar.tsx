import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Type, Image, Square, Circle, Layers, Settings, Palette } from "lucide-react";
import { TextLayer, ImageLayer, ShapeLayer } from "@/types/editor";
import { useRef, useState } from "react";
import { Sidebar, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";

interface ToolbarProps {
  onAddText: () => void;
  onAddImage: (src: string) => void;
  onAddShape: (shapeType: "rectangle" | "circle") => void;
  onPanelChange?: (panel: "layers" | "properties" | "colors" | null) => void;
  onFontPanelToggle?: (show: boolean) => void;
  onFontSelect?: (font: string) => void;
}

export const Toolbar = ({
  onAddText,
  onAddImage,
  onAddShape,
  onPanelChange,
  onFontPanelToggle,
  onFontSelect
}: ToolbarProps) => {
  const [activePanel, setActivePanel] = useState<"layers" | "properties" | "colors" | null>(null);
  const [showFontPanel, setShowFontPanel] = useState(false);

  const handleTextClick = () => {
    setShowFontPanel(!showFontPanel);
    onFontPanelToggle?.(!showFontPanel);
    onAddText();
  };

  const handlePanelClick = (panel: "layers" | "properties" | "colors") => {
    const newPanel = activePanel === panel ? null : panel;
    setActivePanel(newPanel);
    onPanelChange?.(newPanel);
  }
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const src = event.target?.result as string;
        onAddImage(src);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Sidebar collapsible="none" className="w-13">
      <SidebarGroup>
        <SidebarMenu className="space-y-2">
          <SidebarMenuItem onClick={handleTextClick}>
            <SidebarMenuButton isActive={showFontPanel} title="Add Text">
              <Type className="w-4 h-4" />
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem onClick={() => fileInputRef.current?.click()}>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <SidebarMenuButton title="Add Image">
              <Image className="w-4 h-4" />
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem onClick={() => onAddShape("rectangle")}>
            <SidebarMenuButton title="Rectangle">
              <Square className="w-4 h-4" />
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem onClick={() => onAddShape("circle")}>
            <SidebarMenuButton title="Circle">
              <Circle className="w-4 h-4" />
            </SidebarMenuButton>
          </SidebarMenuItem>

          <Separator className="my-2" />

          <SidebarMenuItem onClick={() => handlePanelClick("layers")}>
            <SidebarMenuButton isActive={activePanel === "layers"} title="Layers">
              <Layers className="w-4 h-4" />
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem onClick={() => handlePanelClick("properties")}>
            <SidebarMenuButton isActive={activePanel === "properties"} title="Properties">
              <Settings className="w-4 h-4" />
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem onClick={() => handlePanelClick("colors")}>
            <SidebarMenuButton isActive={activePanel === "colors"} title="Colors">
              <Palette className="w-4 h-4" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </Sidebar>
  );
};
