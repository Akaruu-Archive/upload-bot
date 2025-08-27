import os
import subprocess
import speech_recognition as sr

current_dir = os.path.dirname(os.path.abspath(__file__))

def transcription(video_file):
  audio_file = "audio_temp.wav"
  ffmpeg_path = os.path.join(current_dir, "bin", "ffmpeg.exe")
  subprocess.run([ffmpeg_path, '-i', video_file, '-ac', '1', '-ar', '16000', audio_file])
  recognizer = sr.Recognizer()

  with sr.AudioFile(audio_file) as source:
    audio_data = recognizer.record(source)
    try:
      transcription = recognizer.recognize_google(audio_data, language='fr-FR')
    except sr.UnknownValueError:
      transcription = "Erreur : La voix n'a pas pu être reconnue."
    except sr.RequestError as e:
      transcription = f"Erreur de service : {e}"

  os.remove(audio_file)
  return transcription