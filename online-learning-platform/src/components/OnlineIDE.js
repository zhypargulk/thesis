import React, { useState, useCallback } from "react";
import axios from "axios";
import { Button } from "primereact/button";
import CodeMirror from "@uiw/react-codemirror";

function OnlineIDE() {
  const [code, setCode] = useState();
  const [testCaseResults, setTestCaseResults] = useState([]);

  const onChange = useCallback((editor, data, value) => {
    setCode(editor);
  }, []);

  const checkCode = () => {
    axios
      .post("http://localhost:80/python", { code: code })
      .then(({ data }) => {
        setTestCaseResults(data.testCaseResults);
      })
      .catch((err) => console.log(err));
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
            onClick={checkCode}
            className="border-2 p-2 bg-green-600"
            label="Submit Code"
          />
        </div>
      </header>
    </div>
  );
}

export default OnlineIDE;
