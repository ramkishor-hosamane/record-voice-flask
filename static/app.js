
    $(document).ready(function () {
        var is_recording = false;




        URL = window.URL || window.webkitURL;

        var gumStream;                      //stream from getUserMedia()
        var rec;                            //Recorder.js object
        var input;                          //MediaStreamAudioSourceNode we'll be recording

        // shim for AudioContext when it's not avb. 
        var AudioContext = window.AudioContext || window.webkitAudioContext;
        var audioContext //audio context to help us record






        $("#loading").hide()
        $("#processing").hide()





        $("#record_btn").click(function () {
            $("#loading").toggle();
            $("#record_btn>i").toggle();

            if (!is_recording) {
                $("#record_btn>span").text("Stop");
                //recording code



                var constraints = { audio: true, video: false }

                navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
                    console.log("getUserMedia() success, stream created, initializing Recorder.js ...");

                    /*
                        create an audio context after getUserMedia is called
                        sampleRate might change after getUserMedia is called, like it does on macOS when recording through AirPods
                        the sampleRate defaults to the one set in your OS for your playback device
            
                    */
                    audioContext = new AudioContext();

                    //update the format 
                    //document.getElementById("formats").innerHTML = "Format: 1 channel pcm @ " + audioContext.sampleRate / 1000 + "kHz"

                    /*  assign to gumStream for later use  */
                    gumStream = stream;

                    /* use the stream */
                    input = audioContext.createMediaStreamSource(stream);

                    /* 
                        Create the Recorder object and configure to record mono sound (1 channel)
                        Recording 2 channels  will double the file size
                    */
                    rec = new Recorder(input, { numChannels: 1 })

                    //start the recording process
                    rec.record()

                    console.log("Recording started");

                }).catch(function (err) {
                    console.log("Error")
                    console.log(err)

                });




            }
            else {
                $("#record_btn>span").text("Record");


                //stop recording code

                console.log("stopButton clicked");
                $("#processing").show()



                //tell the recorder to stop the recording
                rec.stop();

                //stop microphone access
                gumStream.getAudioTracks()[0].stop();

                //create the wav blob and pass it on to createDownloadLink
                rec.exportWAV(createDownloadLink);
            }
            is_recording = !is_recording;


        })
    })

/*

 var au = document.createElement('audio');
        var li = document.createElement('li');
        var link = document.createElement('a');



 //add controls to the <audio> element
        au.controls = true;
        au.src = url;

        //save to disk link
        link.href = url;
        link.download = filename + ".wav"; //download forces the browser to donwload the file using the  filename
        link.innerHTML = "Save to disk";

        //add the new audio element to li
        li.appendChild(au);

        //add the filename to the li
        li.appendChild(document.createTextNode(filename + ".wav "))

        //add the save to disk link to li
        li.appendChild(link);

        //upload link
        var upload = document.createElement('a');
        upload.href = "#";
        upload.innerHTML = "Upload";



*/

    function createDownloadLink(blob) {

        var url = URL.createObjectURL(blob);
       
        var filename = new Date().toISOString();

       

        //AJAX Call
        var xhr = new XMLHttpRequest();
        xhr.onload = function (e) {
            if (this.readyState === 4) {
                console.log("Server returned: ", e.target.responseText);

                $("#processing").hide()

            }
        };
        var fd = new FormData();
        fd.append("audio_data", blob, filename);
        xhr.open("POST", "/home", true);
        xhr.send(fd);



        
    }


    