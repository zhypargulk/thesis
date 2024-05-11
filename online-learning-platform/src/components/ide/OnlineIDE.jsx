import React, { useState, useEffect } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { vscodeDark } from "@uiw/codemirror-theme-vscode";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import axios from "axios";
import MenubarCustom from "../menu/Menubar";
import { getAllTasks, updateGroupTaskStatus } from "../../controller/Tasks";
import { updateGroupAnswer, getCourseByRef } from "../../controller/Groups";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Message } from "primereact/message";
import "./OnlineIDE.css";
import { getDocumentById } from "../../controller/Courses";

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
  const [isCorrect, setIsCorrect] = useState(undefined);
  const [allCode, setAllCode] = useState();
  const [tasks, setTasks] = useState([]);
  const [answer, setAnswer] = useState();
  const [checkAnswer, setCheckAnswer] = useState();
  const { docId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      if (docId) {
        const fetchedTasks = await getAllTasks(docId);
        if (fetchedTasks.length !== 0) {
          const courseRef = fetchedTasks[0].courseRef;
          const courseData = await getCourseByRef(courseRef);

          const group = await getDocumentById("groups", docId);
          setIsCorrect(group.success);
          setTasks(fetchedTasks);
          if (group && group.output) {
            setOutput(group.output);
          }

          setAnswer(courseData.answer);
          const codes = fetchedTasks
            .filter((task) => task.code)
            .map((task) => task.code);
          const allCodeString = codes.join("\n");
          setAllCode(allCodeString);
        }
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    if (output) {
      if (String(output).trim() == String(answer).trim()) {
        setCheckAnswer({
          status: "success",
          message: "Code execution successful!",
        });
        updateGroupAnswer(docId, true);
        setIsCorrect(true);
        updateGroupTaskStatus(docId, output, true);
      } else {
        setCheckAnswer({
          status: "error",
          message: `Error! Code execution failed! The answer is "${answer}"`,
        });
        setIsCorrect(false);
        updateGroupAnswer(docId, false);
        updateGroupTaskStatus(docId, output, false);
      }
    }
  }, [output]);

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

      // This check may be using the old value of output
      if (String(response.data.data).trim() == String(answer).trim()) {
        setCheckAnswer({
          status: "success",
          message: "Code execution successful!",
        });
        updateGroupAnswer(docId, true);
        setIsCorrect(true);
      } else {
        setCheckAnswer({
          status: "error",
          message: `Error! Code execution failed! The answer is "${answer}"`,
        });
        setIsCorrect(false);
        updateGroupAnswer(docId, false);
      }
    } catch (error) {
      updateGroupAnswer(docId, false);
      setOutput(`Error: ${error.message}`);
      setCheckAnswer({
        status: "error",
        message: `Execution Error: ${error.message}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLanguageChange = (e) => {
    const selected = languages.find((lang) => lang.value === e.value);
    if (selected.value !== lastLanguage) {
      setSelectedLanguage(selected);
      setLastLanguage(selected.value);
    }
  };

  return (
    <>
      <MenubarCustom />
      <div className="flex">
        <div className="flex-grow-1">
          <Dropdown
            value={selectedLanguage.value}
            options={languages}
            onChange={handleLanguageChange}
            optionLabel="label"
            placeholder="Select a language"
            className="w-full mt-3"
            data-testid='dropdownTest'
          />
          <CodeMirror
            value={allCode}
            extensions={[selectedLanguage.mode]}
            height="600px"
            theme={vscodeDark}
            onChange={(newValue) => {
              setAllCode(newValue);
            }}
          />
          <Button
            label="Run Code"
            loading={isLoading}
            onClick={() => executeCode(selectedLanguage.value, allCode)}
            className="p-button-success mt-2 h-3"
          />

          {isCorrect != undefined && (
            <Message
              severity={isCorrect ? "success" : "error"}
              text={
                isCorrect
                  ? "Previous code check was successful!"
                  : `Previous code check failed.The correct answer is ${answer}`
              }
              className="mt-2 ml-5"
            />
          )}

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
          <Button
            label="Back to the board"
            loading={isLoading}
            onClick={() => navigate(`/groups/${docId}/board`)}
            className="p-button-success mt-2 h-3"
          />
        </div>
        <div className="task-container">
          <h2 className="task-title text-white">
            Get all completed tasks code
          </h2>
          <p className="task-title text-white">
            Run code to check if the project was done successfully
          </p>
          <div>
            {tasks.map((task, index) => (
              <div key={index} className="task-card">
                <div className="task-title">{task.title}</div>
                <pre className="task-code">{task.code}</pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default OnlineIDE;
