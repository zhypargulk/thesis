import React, { useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import axios from "axios";
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
  {
    label: "C++",
    value: "cpp",
    initialCode: `#include <iostream>\nint main() {\n\tstd::cout << "Hello, world!" << std::endl;\n\treturn 0;\n}`,
    mode: cpp(),
  },
];

function OnlineIDE() {
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [code, setCode] = useState(selectedLanguage.initialCode);
  const [output, setOutput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lastLanguage, setLastLanguage] = useState(selectedLanguage.value);

  const API = axios.create({ baseURL: "http://127.0.0.1:5000" });

  const executeCode = async (language, sourceCode) => {
    setIsLoading(true);
    try {
      const response = await API.post("/execute", {
        language: language,
        sourceCode: sourceCode,
      });
      setOutput(
        response.data.data !== "" ? response.data.data : response.data.error
      );
    } catch (error) {
      console.error("Error executing code:", error);
      setOutput(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (e) => {
    const selected = languages.find((lang) => lang.value === e.value);
    if (selected.value !== lastLanguage) {
      setSelectedLanguage(selected);
      setCode(selected.initialCode);
      setLastLanguage(selected.value);
    }
  };

  return (
    <>
      <MenubarCustom />
      <Dropdown
        value={selectedLanguage.value}
        options={languages}
        onChange={handleLanguageChange}
        optionLabel="label"
        placeholder="Select a language"
        className="w-full mt-3"
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
        loading={isLoading}
        onClick={() => executeCode(selectedLanguage.value, code)}
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
