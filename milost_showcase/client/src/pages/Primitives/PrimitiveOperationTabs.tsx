import { TabsContainer, Tab } from "./Primitives.styles";
import { PrimitiveOperationCategory } from "./types";

interface PrimitiveOperationTabsProps {
  activeCategory: PrimitiveOperationCategory;
  setActiveCategory: (category: PrimitiveOperationCategory) => void;
}

function PrimitiveOperationTabs({
  activeCategory,
  setActiveCategory,
}: PrimitiveOperationTabsProps) {
  const categories: {
    id: PrimitiveOperationCategory;
    label: string;
  }[] = [
    { id: "create", label: "Create" },
    { id: "arithmetic", label: "Arithmetic" },
    { id: "bitwise", label: "Bitwise" },
    { id: "format", label: "Format" },
    { id: "bitManipulation", label: "Bit Manipulation" },
    { id: "validate", label: "Validate" },
    { id: "convert", label: "Convert" },
  ];

  return (
    <TabsContainer>
      {categories.map((category) => (
        <Tab
          key={category.id}
          active={activeCategory === category.id}
          onClick={() => setActiveCategory(category.id)}
        >
          {category.label}
        </Tab>
      ))}
    </TabsContainer>
  );
}

export default PrimitiveOperationTabs;
