from flask import Flask,render_template,Response,redirect,request,url_for
import cv2
app = Flask(__name__)
#time.sleep(2)
import numpy as np
import os
import time
import json
PEOPLE_FOLDER = os.path.join('static', 'Images')

app.config['UPLOAD_FOLDER'] = PEOPLE_FOLDER

app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0



@app.route("/")
def index():
    return redirect("home")   

@app.route("/home",methods=['POST', 'GET'])
def home():
    if request.method == "POST":
        f = request.files['audio_data']
        with open('audio.wav', 'wb') as audio:
            f.save(audio)
        print('file uploaded successfully')
        
        #lets assume 5sec to process audio hehe
        time.sleep(5)
        
        return render_template("home.html",request="POST")
    return render_template("home.html")

if __name__ == "__main__":
    app.run(debug=True)