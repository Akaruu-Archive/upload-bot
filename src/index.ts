import colors from 'colors';
import figlet from 'figlet';
import * as path from 'path';
import { promises as fs } from 'fs';

import upload from './functions/upload';
import transcription from './functions/transcription';
import addBdd from './functions/addBdd';
import getFirstFrame from './functions/getFirstFrame';
import convert from './functions/convert';

function checkFileExtension(filePath: string, extension: string): boolean {
  let fileExtension = path.extname(filePath);

  return fileExtension === extension;
};


(async () => {
  const datas = await require('../datas.json');

  await figlet('AKARUU ARCHIVE', (err: Error | null, data: string | undefined) => {
    if (err) {
      console.log(err);
      return;
    };
    if (data) {
      console.log(colors.blue(data));
      return;
    };
  });

  for (let i = 0; i <= datas.length; i++) {
    let data = datas[i];
    let vid = data.video;

    if (!vid) {
      let linkImg = await upload(data.picture) as string;
      let cc = "";
      let link = "";

      let inBdd = await addBdd(
        link,
        data.type,
        data.title,
        data.description,
        cc,
        linkImg
      );


      console.log(inBdd);
      return;
    } else {
      var file = "";
      var fileinfo = "";

      if (await checkFileExtension(vid, ".mp4")) {
        file = vid;
      } else {
        file = await convert(vid) as string;
        fileinfo = "tmp";
      };

      if (file !== "") {
        let link = await upload(file) as string;
        let cc = await transcription(file) as string;
        let img = await getFirstFrame(file) as string;
        let linkImg = await upload(img) as string;

        let inBdd = await addBdd(
          link,
          data.type,
          data.title,
          data.description,
          cc,
          linkImg
        );

        await fs.unlink(img);

        if(fileinfo === "tmp") {
          await fs.unlink(file);
        };

        return console.log(inBdd);
      };
    };
  };
})();