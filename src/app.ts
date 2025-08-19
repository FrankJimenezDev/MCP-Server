import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Create an MCP server
const server = new McpServer({
    name: "demo-server",
    version: "1.0.0"
});

// Add a dynamic greeting resource
server.registerResource(
    "get users demo",
    new ResourceTemplate("users://{usernameOrEmail}/user", { list: undefined }),
    {
        title: "Greeting Resource",      // Display name for UI
        description: "Dynamic greeting generator"
    },
    async (uri, { usernameOrEmail }) => {
    // userId proviene de la URI, ej: "users://123/profile"
    const response = await fetch(`http://localhost:3000/users/${usernameOrEmail}`);
    const data = await response.json();
    return {
      contents: [{ uri: uri.href, text: JSON.stringify(data, null, 2) }]
    };
  }
);

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();

server.connect(transport)
    .then(() => {
        console.log("MCP server is ready to receive messages.");
    }).catch(err => {
        console.error("Error initializing MCP server:", err);
    })