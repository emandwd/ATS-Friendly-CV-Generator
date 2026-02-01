========================================================
Readme File – CV Maker Using ATS System Web App Project
========================================================

Course: 25CPE4203 – Software Engineering  
Project: CV Maker Using ATS System Web App  
Developers: 
	1. Malak Mohamed Saad 257719 (A3)
	2. Eman Mohamed Dawood 254065 (A3)
	3. Fares Haitham 251430 (A1)
	4. Abdallah Mamdouh 252798 (A1)
	5. Omar Mahmoud 257749 (A1)

=====================================================
1. Running the System Online (Hosted Version)
=====================================================

We provide an online hosted version of the web application.

You can access the live system at the following URL:

    https://myperfectcv.onrender.com/

Notes about the hosted version:
• The website may sometimes open immediately.  
• In some cases, The website enters a sleep mode after 15 minutes of inactivity. When you return, it may take a few minutes to become fully responsive again.
  -->In this case, you will first see a loading page while Render boots the system. After a short wait, the full website will open normally and will be ready for use.  

No installation, setup, or backend running is required when using the hosted version.

=====================================================
2. Running Environment
===================================================== 

• Programming Language: Python 3.10+  
• Backend Framework: Flask  
• Frontend: HTML, CSS, JavaScript  
• Required Python Libraries:
  - flask
  - flask-cors
  - python-docx
  - openai
  - json, tempfile, shutil (built-in)
• Model Used: gpt-5-nano (via OpenAI API)

=====================================================
3. Installing Dependencies
=====================================================

1) Open Command Prompt 
2) Run:
    pip install flask flask-cors python-docx openai

=====================================================
4. How to Run the Backend Server 
=====================================================

The backend code is written in Microsoft Visual Studio

Open Command Prompt, write:
    cd {app.py full path} --> e.g., cd C:\Users\Malak\source\repos\cv_maker\cv_maker\(app.py)
										        │
											├─>remove this from the path-->so run on the cmd: cd C:\Users\Malak\source\repos\cv_maker\cv_maker\
then run:
	python app.py

=====================================================
5. How to Run the Frontend (Web Interface)
=====================================================

The Frontend code is written in Visual Studio Code

Simply open the visual studio code, open the "live server" in a browser (Chrome recommended).

The frontend communicates with the backend using:
POST → /api/process-cv

=====================================================
6. API Endpoints
=====================================================

1) POST /api/process-cv  
   • Accepts JSON CV data  
   • Calls OpenAI to structure the CV  
   • Generates a .docx file using python-docx  
   • Returns the DOCX file as a download  
   • Automatically wipes temporary JSON files

2) GET /api/health  
   • Returns service status ("healthy")

=====================================================
7. Folder Structure
=====================================================

Backend files/
│
├── app.py                  → Main Flask backend API  
├── backend_1.py            → CVProcessor class (clean → AI → structured JSON)  
├── cv_generator.py         → DOCX file generator (ATS-friendly)  
├── system_prompt.txt       → AI formatting instructions  

Frontend files/
│
├── index.html              → Main UI  
├── style.css               → Frontend styles  
├── app.js                  → All frontend logic + validation  
└── Assets                  → Contain CV samples shown in the Home Page

=====================================================
8. How the System Works
=====================================================

1) User fills multi-step form in the frontend  
2) JavaScript validates, stores, and collects the data  
3) JavaScript sends JSON to the backend  
4) Backend:
   • Saves raw JSON  
   • Cleans + structures data using OpenAI  
   • Creates an ATS-optimized DOCX CV  
   • Sends file back to frontend  
   • Deletes temporary user data for privacy
5) Frontend:
   • Auto-downloads DOCX  
   • Shows success message  
   • Clears all stored data in local storage