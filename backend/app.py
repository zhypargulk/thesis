from flask import Flask, request
from flask_cors import CORS 
import json 
import subprocess
import tempfile
import os

app = Flask(__name__) 
CORS(app)
@app.route("/execute", methods=['POST'])
def run():
    tempter = tempfile.mkdtemp()
    if(request.json['language'] == "java"):
        with open(os.path.join(tempter, "Main.java"), "w") as file:
            file.write(request.json["sourceCode"])

        output = subprocess.run(["javac", os.path.join(tempter, "Main.java")], capture_output=True, text=True)
        a = subprocess.run(["java", "-cp", tempter, "Main"], capture_output=True, text=True)

        print(a.stdout, output.stderr)
        return json.dumps({"data": a.stdout, "error": output.stderr})

app.run()

#java python JS TS 