#!/usr/bin/env node

const minimist = require("minimist");
const { createProject } = require("../index");

const args = minimist(process.argv.slice(2));
const command = args._[0];

if (command === "create") {
  const projectName = args._[1];
  const template = args.template || "basic";

  if (!projectName) {
    console.error("Please specify a project name");
    process.exit(1);
  }

  createProject(projectName, template)
    .then(() => {
      console.log("Project created successfully!");
      console.log(`Run 'cd ${projectName}' and 'npm install' to get started`);
    })
    .catch((err) => {
      console.error("Error creating project:", err);
      process.exit(1);
    });
} else {
  console.error("Unknown command. Available commands: create");
  process.exit(1);
}
