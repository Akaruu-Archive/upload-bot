import ffmpeg from 'fluent-ffmpeg';
import path from 'path';

const ffmpegPath = path.resolve(__dirname, '../python/bin/ffmpeg.exe');

ffmpeg.setFfmpegPath(ffmpegPath);

const outputFilePath = path.resolve(__dirname, '../../tmp/videos/videotmp.mp4');

export default async (inputFilePath: string) => {
  return new Promise((resolve, reject) => {
    ffmpeg(inputFilePath)
      .output(outputFilePath)
      .on('end', () => {
        return resolve(outputFilePath);
      })
      .on('error', (err) => {
        return reject(err);
      })
      .run();
  });
};