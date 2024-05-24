# app.py
from flask import Flask, request
from flask_cors import CORS
import json
import subprocess
import tempfile
import os

def create_app():
    app = Flask(__name__)
    CORS(app)

    @app.route("/execute", methods=['POST'])
    def run():
        tempter = tempfile.mkdtemp()
        if request.json['language'] == "java":
            with open(os.path.join(tempter, "Main.java"), "w") as file:
                file.write(request.json["sourceCode"])

            output = subprocess.run(["javac", os.path.join(tempter, "Main.java")], capture_output=True, text=True)
            a = subprocess.run(["java", "-cp", tempter, "Main"], capture_output=True, text=True)
            return json.dumps({"data": a.stdout, "error": output.stderr})

        elif request.json['language'] == "javascript":
            with open(os.path.join(tempter, "script.js"), "w") as file:
                file.write(request.json["sourceCode"])

            output = subprocess.run(["node", os.path.join(tempter, "script.js")], capture_output=True, text=True)
            return json.dumps({"data": output.stdout, "error": output.stderr})

        elif request.json['language'] == "python":
            with open(os.path.join(tempter, "script.py"), "w") as file:
                file.write(request.json["sourceCode"])

            output = subprocess.run(["python3", os.path.join(tempter, "script.py")], capture_output=True, text=True)
            return json.dumps({"data": output.stdout, "error": output.stderr})

        elif request.json['language'] == "cpp":
            with open(os.path.join(tempter, "main.cpp"), "w") as file:
                file.write(request.json["sourceCode"])

            compile_output = subprocess.run(["g++", os.path.join(tempter, "main.cpp"), "-o", os.path.join(tempter, "main")], capture_output=True, text=True)
            if compile_output.returncode != 0:  
                return json.dumps({"data": "", "error": compile_output.stderr})

            execution_output = subprocess.run([os.path.join(tempter, "main")], capture_output=True, text=True)
            return json.dumps({"data": execution_output.stdout, "error": execution_output.stderr})

    return app

if __name__ == "__main__":
    app = create_app()
    app.run()
