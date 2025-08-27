import { exec } from 'child_process';

export default async (video: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    return exec(`py ../src/python/transcription.py "${video}"`, (error, stdout, stderr) => {
      return resolve(stdout);
    });
  });
};