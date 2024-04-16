import React, { useState, useCallback } from "react";
import axios from "axios";
import { Button } from "primereact/button";
import CodeMirror from "@uiw/react-codemirror";

export const LANGUAGE_VERSIONS = {
  javascript: "18.15.0",
  typescript: "5.0.3",
  python: "3.10.0",
  java: "15.0.2",
  csharp: "6.12.0",
  php: "8.2.3",
};

export const CODE_SNIPPETS = {
  javascript: `\nfunction greet(name) {\n\tconsole.log("Hello, " + name + "!");\n}\n\ngreet("Alex");\n`,
  typescript: `\ntype Params = {\n\tname: string;\n}\n\nfunction greet(data: Params) {\n\tconsole.log("Hello, " + data.name + "!");\n}\n\ngreet({ name: "Alex" });\n`,
  python: `\ndef greet(name):\n\tprint("Hello, " + name + "!")\n\ngreet("Alex")\n`,
  java: `\npublic class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}\n`,
  csharp:
    'using System;\n\nnamespace HelloWorld\n{\n\tclass Hello { \n\t\tstatic void Main(string[] args) {\n\t\t\tConsole.WriteLine("Hello World in C#");\n\t\t}\n\t}\n}\n',
  php: "<?php\n\n$name = 'Alex';\necho $name;\n",
};
function OnlineIDE() {
  const [code, setCode] = useState();
  const [testCaseResults, setTestCaseResults] = useState([]);

  const onChange = useCallback((editor, data, value) => {
    setCode(editor);
  }, []);

  const checkCode = () => {
    // axios
    //   .post("http://localhost:80/python", { code: code })
    //   .then(({ data }) => {
    //     setTestCaseResults(data.testCaseResults);
    //   })
    //   .catch((err) => console.log(err));
  };
  const API = axios.create({ baseURL:"http://127.0.0.1:5000"});
   const executeCode = async (language, sourceCode) => {
    const response = await API.post("/execute", {language: language, sourceCode:sourceCode});
    return response.data;
  };

  let lastRequestTime = 0;

  const executeCodeWithRateLimit = async (language, sourceCode) => {
    const currentTime = Date.now();
    const timeSinceLastRequest = currentTime - lastRequestTime;
    const rateLimitInterval = 60000; // Example: 60 seconds

    if (timeSinceLastRequest < rateLimitInterval) {
      const delay = rateLimitInterval - timeSinceLastRequest;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    lastRequestTime = Date.now();

    try {
      const response = await executeCode(language, sourceCode);
      const result = response.run.output; // Access the result from the response
      console.log(result);
    } catch (error) {
      console.error("Error executing code:", error);
    }
  };

  return (
    <div>
      <header>
        <div>
          <div>Create a function to add two numbers.</div>
          <div className="flex space-x-2">
            {testCaseResults.map((res, i) => (
              <div key={i}>
                <div>{res === "True" ? "✅ passed" : "❌ failed"}</div>
              </div>
            ))}
          </div>
          <CodeMirror
            value={code}
            options={{
              theme: "dracula",
              keyMap: "sublime",
              mode: "python",
            }}
            onChange={onChange}
            className="w-96 h-80"
          />
          <Button
            onClick={() =>
              executeCode(
                "java",
                'public class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello, world!");\n\t}\n}'
              ) 
            }
            className="border-2 p-2 bg-green-600"
            label="Submit Code"
          />
        </div>
      </header>
    </div>
  );
}

export default OnlineIDE;
