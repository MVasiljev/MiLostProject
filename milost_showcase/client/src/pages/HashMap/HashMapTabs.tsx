import { TabsContainer, Tab } from "./HashMap.styles";
import { HashMapOperationCategory } from "./types";

interface HashMapTabsProps {
  activeCategory: HashMapOperationCategory;
  setActiveCategory: (category: HashMapOperationCategory) => void;
}

const HashMapTabs: React.FC<HashMapTabsProps> = ({
  activeCategory,
  setActiveCategory,
}) => {
  return (
    <TabsContainer>
      <Tab
        active={activeCategory === "analyze"}
        onClick={() => setActiveCategory("analyze")}
      >
        Analyze
      </Tab>
      <Tab
        active={activeCategory === "get"}
        onClick={() => setActiveCategory("get")}
      >
        Get
      </Tab>
      <Tab
        active={activeCategory === "contains"}
        onClick={() => setActiveCategory("contains")}
      >
        Contains
      </Tab>
      <Tab
        active={activeCategory === "set"}
        onClick={() => setActiveCategory("set")}
      >
        Set
      </Tab>
      <Tab
        active={activeCategory === "remove"}
        onClick={() => setActiveCategory("remove")}
      >
        Remove
      </Tab>
      <Tab
        active={activeCategory === "keys"}
        onClick={() => setActiveCategory("keys")}
      >
        Keys
      </Tab>
      <Tab
        active={activeCategory === "values"}
        onClick={() => setActiveCategory("values")}
      >
        Values
      </Tab>
      <Tab
        active={activeCategory === "entries"}
        onClick={() => setActiveCategory("entries")}
      >
        Entries
      </Tab>
      <Tab
        active={activeCategory === "map"}
        onClick={() => setActiveCategory("map")}
      >
        Map
      </Tab>
      <Tab
        active={activeCategory === "filter"}
        onClick={() => setActiveCategory("filter")}
      >
        Filter
      </Tab>
    </TabsContainer>
  );
};

export default HashMapTabs;
