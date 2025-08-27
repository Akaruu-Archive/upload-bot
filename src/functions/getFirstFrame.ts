import ffmpeg from 'fluent-ffmpeg';
import path from 'path';

const ffmpegPath = path.resolve(__dirname, '../python/bin/ffmpeg.exe');
const ffprobePath = path.resolve(__dirname, '../python/bin/ffprobe.exe');

ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

const outputFilePath = path.resolve(__dirname, '../../tmp/images/imagetmp.png');

export default async (url: string): Promise<void | string> => {
  return new Promise((resolve, reject) => {
    ffmpeg(url)
      .on('end', () => {
        return resolve(outputFilePath);
      })
      .on('error', (err) => {
        return reject(err);
      })
      .screenshots({
        count: 1,
        folder: path.dirname(outputFilePath),
        filename: path.basename(outputFilePath),
        size: '320x240'
      });
  });
};