## Launch Visual Acad UI

Make sure you have Node.js, `nvm`, and `npm` installed. 

Run `npm install` to install all dependencies. Then in `LLM-UI/`, run `npm start` to start the react webpage host. The UI webpage will be hosted on http://localhost:3000. You can paste this address in browser to view it.

The UI reads the flowchart description file from example.js. You can modify this file to create a new flowchart.

## Local Setup
Create and activate a virtual environment with python 3.11, preferably using conda. One can install conda by following the steps [here](https://developers.google.com/earth-engine/guides/python_install-conda)
```
conda create -n vacad python=3.11
conda activate vacad
```

Install python requirements
```
pip install -r requirements.txt
```

Launch the application using the launch script
```
uvicorn app:app --host 0.0.0.0  
```