import tempfile
import subprocess
import os
import json
import pytest
from unittest.mock import patch, Mock
from app import create_app

@pytest.fixture
def client():
    app = create_app()
    with app.test_client() as client:
        yield client

@patch('subprocess.run')
def test_java_code_execution(mock_subprocess_run, client):
    mock_subprocess_run.return_value = Mock(stdout='Hello, Java!', stderr='')

    response = client.post('/execute', json={
        'language': 'java',
        'sourceCode': 'public class Main { public static void main(String[] args) { System.out.println("Hello, Java!"); } }'
    })

    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['data'] == 'Hello, Java!'
    assert data['error'] == ''

@patch('subprocess.run')
def test_javascript_code_execution(mock_subprocess_run, client):
    mock_subprocess_run.return_value = Mock(stdout='Hello, JavaScript!', stderr='')

    response = client.post('/execute', json={
        'language': 'javascript',
        'sourceCode': 'console.log("Hello, JavaScript!");'
    })

    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['data'] == 'Hello, JavaScript!'
    assert data['error'] == ''

@patch('subprocess.run')
def test_python_code_execution(mock_subprocess_run, client):
    mock_subprocess_run.return_value = Mock(stdout='Hello, Python!', stderr='')

    response = client.post('/execute', json={
        'language': 'python',
        'sourceCode': 'print("Hello, Python!")'
    })

    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['data'] == 'Hello, Python!'
    assert data['error'] == ''

@patch('subprocess.run')
def test_cpp_code_execution(mock_subprocess_run, client):
    mock_subprocess_run.side_effect = [
        Mock(returncode=0, stdout='', stderr=''), 
        Mock(returncode=0, stdout='Hello, C++!', stderr='') 
    ]

    response = client.post('/execute', json={
        'language': 'cpp',
        'sourceCode': '#include <iostream>\nint main() { std::cout << "Hello, C++!"; return 0; }'
    })

    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['data'] == 'Hello, C++!'
    assert data['error'] == ''
