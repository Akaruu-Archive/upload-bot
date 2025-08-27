import os
import subprocess
import speech_recognition as sr
import argparse

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

if __name__ == "__main__":
  parser = argparse.ArgumentParser(description='Transcription audio à partir d\'une vidéo.')
  parser.add_argument('video_file', type=str, help='URL ou chemin du fichier vidéo à transcrire')
  
  args = parser.parse_args()
  
  result = transcription(args.video_file)
  print(result)