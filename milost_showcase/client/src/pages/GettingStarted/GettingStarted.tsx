import {
  Container,
  Header,
  Title,
  Subtitle,
  Card,
  CardTitle,
  CodeBlock,
  Pre,
  SmallText,
  TabsContainer,
  Tab,
} from "./GettingStarted.styles";
import { useState } from "react";

function GettingStartedPage() {
  const [activeFramework, setActiveFramework] = useState<string>("nodejs");

  const frameworkConfigs = {
    nodejs: {
      packageJson: `{
    "name": "milost-example",
    "version": "1.0.0",
    "type": "module",
    "dependencies": {
      "milost": "^1.0.35"
    },
    "scripts": {
      "start": "node index.js"
    }
  }`,
      installCommand: "npm install milost",
      basicUsage: `import { Str, Vec, HashMap } from "milost";
  
  // String operations
  const greeting = Str.fromRaw("Hello, world!");
  console.log(greeting.toUpperCase().unwrap()); // "HELLO, WORLD!"
  
  // Vector operations
  const numbers = Vec.from([1, 2, 3, 4, 5]);
  const doubled = numbers.map(n => n * 2);
  console.log(doubled.toArray()); // [2, 4, 6, 8, 10]
  
  // HashMap operations
  const userMap = HashMap.from([
    ["name", "John"],
    ["age", 30]
  ]);
  console.log(userMap.get("name")); // "John"`,
      configDetails: "Standard Node.js project with ES modules",
    },
    vite: {
      packageJson: `{
    "name": "milost-vite-example",
    "version": "1.0.0",
    "type": "module",
    "scripts": {
      "dev": "vite",
      "build": "tsc && vite build",
      "preview": "vite preview"
    },
    "dependencies": {
      "milost": "^1.0.35",
      "react": "^19.0.0",
      "react-dom": "^19.0.0"
    },
    "devDependencies": {
      "@types/react": "^19.0.0",
      "@types/react-dom": "^19.0.0",
      "@vitejs/plugin-react": "^4.0.0",
      "typescript": "^5.0.0",
      "vite": "^5.0.0"
    }
  }`,
      installCommand:
        "npm create vite@latest milost-app -- --template react-ts",
      additionalSetup: `// Add to vite.config.ts
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react';
  
  export default defineConfig({
    plugins: [react()],
  });`,
      basicUsage: `import { useState } from 'react';
  import { Str, Vec, HashMap } from 'milost';
  
  function App() {
    const [result, setResult] = useState<string>('');
  
    const demonstrateMiLost = () => {
      // String operations
      const greeting = Str.fromRaw("Hello, world!");
      const upperGreeting = greeting.toUpperCase().unwrap();
  
      // Vector operations
      const numbers = Vec.from([1, 2, 3, 4, 5]);
      const doubled = numbers.map(n => n * 2);
  
      // HashMap operations
      const userMap = HashMap.from([
        ["name", "John"],
        ["age", 30]
      ]);
  
      setResult(\`
        Uppercase: \${upperGreeting}
        Doubled Numbers: \${doubled.toArray()}
        User Name: \${userMap.get("name")}
      \`);
    };
  
    return (
      <div>
        <button onClick={demonstrateMiLost}>
          Demonstrate MiLost
        </button>
        <pre>{result}</pre>
      </div>
    );
  }
  
  export default App;`,
      configDetails: "Vite with React and TypeScript setup",
    },
    vue: {
      packageJson: `{
    "name": "milost-vue-example",
    "version": "1.0.0",
    "type": "module",
    "scripts": {
      "dev": "vite",
      "build": "vue-tsc && vite build",
      "preview": "vite preview"
    },
    "dependencies": {
      "milost": "^1.0.35",
      "vue": "^3.3.0"
    },
    "devDependencies": {
      "@vitejs/plugin-vue": "^4.0.0",
      "typescript": "~5.0.0",
      "vite": "^5.0.0",
      "vue-tsc": "^1.0.0"
    }
  }`,
      installCommand: "npm create vue@latest milost-app",
      additionalSetup: `// Add to vite.config.ts
  import { fileURLToPath, URL } from 'node:url';
  import { defineConfig } from 'vite';
  import vue from '@vitejs/plugin-vue';
  
  export default defineConfig({
    plugins: [vue()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  });`,
      basicUsage: `<script setup lang="ts">
  import { ref } from 'vue';
  import { Str, Vec, HashMap } from 'milost';
  
  const result = ref('');
  
  const demonstrateMiLost = () => {
    // String operations
    const greeting = Str.fromRaw("Hello, world!");
    const upperGreeting = greeting.toUpperCase().unwrap();
  
    // Vector operations
    const numbers = Vec.from([1, 2, 3, 4, 5]);
    const doubled = numbers.map(n => n * 2);
  
    // HashMap operations
    const userMap = HashMap.from([
      ["name", "John"],
      ["age", 30]
    ]);
  
    result.value = \`
      Uppercase: \${upperGreeting}
      Doubled Numbers: \${doubled.toArray()}
      User Name: \${userMap.get("name")}
    \`;
  };
  </script>
  
  <template>
    <div>
      <button @click="demonstrateMiLost">
        Demonstrate MiLost
      </button>
      <pre>{{ result }}</pre>
    </div>
  </template>`,
      configDetails: "Vue 3 with TypeScript and Vite",
    },
    angular: {
      packageJson: `{
    "name": "milost-angular-example",
    "version": "1.0.0",
    "scripts": {
      "ng": "ng",
      "start": "ng serve",
      "build": "ng build",
      "test": "ng test"
    },
    "private": true,
    "dependencies": {
      "@angular/core": "^17.0.0",
      "@angular/platform-browser": "^17.0.0",
      "milost": "^1.0.35",
      "rxjs": "~7.8.0",
      "zone.js": "~0.14.0"
    },
    "devDependencies": {
      "@angular-devkit/build-angular": "^17.0.0",
      "@angular/cli": "^17.0.0",
      "@angular/compiler": "^17.0.0",
      "typescript": "~5.2.0"
    }
  }`,
      installCommand: "npx @angular/cli@latest new milost-app",
      additionalSetup: `// app.module.ts
  import { NgModule } from '@angular/core';
  import { BrowserModule } from '@angular/platform-browser';
  import { AppComponent } from './app.component';
  
  @NgModule({
    declarations: [AppComponent],
    imports: [BrowserModule],
    bootstrap: [AppComponent]
  })
  export class AppModule { }`,
      basicUsage: `import { Component } from '@angular/core';
  import { Str, Vec, HashMap } from 'milost';
  
  @Component({
    selector: 'app-root',
    template: \`
      <button (click)="demonstrateMiLost()">
        Demonstrate MiLost
      </button>
      <pre>{{ result }}</pre>
    \`
  })
  export class AppComponent {
    result: string = '';
  
    demonstrateMiLost() {
      // String operations
      const greeting = Str.fromRaw("Hello, world!");
      const upperGreeting = greeting.toUpperCase().unwrap();
  
      // Vector operations
      const numbers = Vec.from([1, 2, 3, 4, 5]);
      const doubled = numbers.map(n => n * 2);
  
      // HashMap operations
      const userMap = HashMap.from([
        ["name", "John"],
        ["age", 30]
      ]);
  
      this.result = \`
        Uppercase: \${upperGreeting}
        Doubled Numbers: \${doubled.toArray()}
        User Name: \${userMap.get("name")}
      \`;
    }
  }`,
      configDetails: "Angular with TypeScript",
    },
  };

  return (
    <Container>
      <Header>
        <Title>
          Getting <Subtitle>Started</Subtitle>
        </Title>
        <Subtitle>
          Integrate MiLost into your favorite framework with ease
        </Subtitle>
      </Header>

      <Card>
        <CardTitle>Framework Setup</CardTitle>

        <TabsContainer>
          {Object.keys(frameworkConfigs).map((framework) => (
            <Tab
              key={framework}
              active={activeFramework === framework}
              onClick={() => setActiveFramework(framework)}
            >
              {framework.charAt(0).toUpperCase() + framework.slice(1)}
            </Tab>
          ))}
        </TabsContainer>

        <div style={{ marginTop: "1rem" }}>
          <h3>Installation</h3>
          <CodeBlock>
            <Pre>
              {`# ${frameworkConfigs[activeFramework].configDetails}
  ${frameworkConfigs[activeFramework].installCommand}`}
            </Pre>
          </CodeBlock>

          {frameworkConfigs[activeFramework].additionalSetup && (
            <div>
              <h3>Configuration</h3>
              <CodeBlock>
                <Pre>{frameworkConfigs[activeFramework].additionalSetup}</Pre>
              </CodeBlock>
            </div>
          )}

          <h3>Package.json</h3>
          <CodeBlock>
            <Pre>{frameworkConfigs[activeFramework].packageJson}</Pre>
          </CodeBlock>

          <h3>Basic Usage</h3>
          <CodeBlock>
            <Pre>{frameworkConfigs[activeFramework].basicUsage}</Pre>
          </CodeBlock>
        </div>
      </Card>

      <Card>
        <CardTitle>Core Concepts</CardTitle>
        <SmallText>
          MiLost provides powerful, immutable data structures inspired by Rust's
          standard library. Each method returns a new instance, ensuring
          predictable and safe data manipulation.
        </SmallText>

        <CodeBlock>
          <Pre>
            {`// Key Principles
  // 1. Immutability
  const original = Str.fromRaw("Hello");
  const modified = original.toUpperCase(); // original remains unchanged
  
  // 2. Error Handling
  const result = someOperation()
    .map(value => processValue(value))
    .unwrapOr("Default Value");
  
  // 3. Functional Transformations
  const numbers = Vec.from([1, 2, 3, 4, 5])
    .filter(n => n % 2 === 0)
    .map(n => n * 2);`}
          </Pre>
        </CodeBlock>
      </Card>

      <Card>
        <CardTitle>Performance & WebAssembly</CardTitle>
        <SmallText>
          MiLost leverages WebAssembly for near-native performance. The library
          automatically falls back to pure JavaScript when WebAssembly is
          unavailable.
        </SmallText>
      </Card>
    </Container>
  );
}

export default GettingStartedPage;
