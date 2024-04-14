import React, { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import MenubarCustom from "./Menubar";

const languages = [
  {
    label: "Python",
    value: "python",
    initialCode: `def greet(name):\n\tprint("Hello, " + name + "!")\n\ngreet("Alex")\n`,
    mode: python(),
  },
  {
    label: "JavaScript",
    value: "javascript",
    initialCode: `function greet(name) {\n\tconsole.log("Hello, " + name + "!");\n}\n\ngreet("Alex");\n`,
    mode: javascript(),
  },
  {
    label: "Java",
    value: "java",
    initialCode: `public class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello, world!");\n\t}\n}`,
    mode: java(),
  },
];

function OnlineIDE() {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [code, setCode] = useState(selectedLanguage.initialCode);
  const [output, setOutput] = useState("");

  const handleLanguageChange = (e) => {
    const selected = languages.find((lang) => lang.value === e.value);
    setSelectedLanguage(selected);
    setCode(selected.initialCode);
  };

  const handleExecuteCode = () => {
    // Simulated output for demonstration
    const exampleOutput = `Output based on the ${selectedLanguage.label} code provided.`;
    setOutput(exampleOutput);
  };

  useEffect(() => {
    setCode(selectedLanguage.initialCode);
  }, [selectedLanguage]);

  return (
    <>
      <MenubarCustom />
      <Dropdown
        value={selectedLanguage.value}
        options={languages}
        onChange={handleLanguageChange}
        optionLabel="label"
        placeholder="Select a language"
        className="w-full"
      />
      <CodeMirror
        value={code}
        extensions={[selectedLanguage.mode]}
        height="600px"
        theme={vscodeDark}
        onChange={(newValue) => setCode(newValue)}
      />
      <Button
        label="Submit Code"
        onClick={handleExecuteCode}
        className="p-button-success mt-2"
      />
      <div
        className="output-field p-inputtext mt-2"
        style={{
          width: "100%",
          minHeight: "100px",
          backgroundColor: "#fff",
          border: "1px solid #ccc",
          padding: "10px",
        }}
      >
        {output}
      </div>
    </>
  );
}

export default OnlineIDE;

// import React, { useState, useCallback } from "react";
// import axios from "axios";
// import { Button } from "primereact/button";
// import CodeMirror from "@uiw/react-codemirror";
// import { vscodeDark } from "@uiw/codemirror-theme-vscode";

// export const LANGUAGE_VERSIONS = ["javascript", "python", "java"];
// export const CODE_SNIPPETS = [
//   `\nfunction greet(name) {\n\tconsole.log("Hello, " + name + "!");\n}\n\ngreet("Alex");\n`,
//   `\ndef greet(name):\n\tprint("Hello, " + name + "!")\n\ngreet("Alex")\n`,
//   `\npublic class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}\n`,
// ];
// function OnlineIDE() {
//   const [code, setCode] = useState();
//   const [testCaseResults, setTestCaseResults] = useState([]);
//   const [selectedLanguage, setSelectedLanguage] = useState("");

//   const onChange = useCallback((editor, data, value) => {
//     setCode(editor);
//   }, []);

//   const API = axios.create({
//     baseURL: "https://emkc.org/api/v2/piston",
//   });
//   const executeCode = async (language, sourceCode) => {
//     const response = await API.post("/execute", {
//       language: language,
//       version: LANGUAGE_VERSIONS[language],
//       files: [
//         {
//           content: sourceCode,
//         },
//       ],
//     });
//     return response.data;
//   };

//   let lastRequestTime = 0;

//   const executeCodeWithRateLimit = async (language, sourceCode) => {
//     const currentTime = Date.now();
//     const timeSinceLastRequest = currentTime - lastRequestTime;
//     const rateLimitInterval = 60000; // Example: 60 seconds

//     if (timeSinceLastRequest < rateLimitInterval) {
//       const delay = rateLimitInterval - timeSinceLastRequest;
//       await new Promise((resolve) => setTimeout(resolve, delay));
//     }

//     lastRequestTime = Date.now();

//     try {
//       const response = await executeCode(language, sourceCode);
//       const result = response.run.output; // Access the result from the response
//       console.log(result);
//     } catch (error) {
//       console.error("Error executing code:", error);
//     }
//   };

//   return (
//     <div>
//       <header>
//         <div>
//           <div>Create a function to add two numbers.</div>
//           <div className="flex space-x-2">
//             {testCaseResults.map((res, i) => (
//               <div key={i}>
//                 <div>{res === "True" ? "✅ passed" : "❌ failed"}</div>
//               </div>
//             ))}
//           </div>
//           <CodeMirror
//             value={code}
//             options={{
//               theme: "dracula",
//               keyMap: "sublime",
//               mode: "python",
//             }}
//             onChange={onChange}
//             className="w-96 h-80"
//             height="500px"
//             theme={vscodeDark}
//           />
//           <Button
//             onClick={() =>
//               executeCodeWithRateLimit(
//                 "java",
//                 'public class Main {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello, world!");\n\t}\n}'
//               )
//             }
//             className="border-2 p-2 bg-green-600"
//             label="Submit Code"
//           />
//         </div>
//       </header>
//     </div>
//   );
// }

// export default OnlineIDE;
