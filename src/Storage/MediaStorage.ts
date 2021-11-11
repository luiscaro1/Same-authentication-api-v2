import { StorageEngine } from "multer";
import axios, { AxiosResponse } from "axios";
import FormData from "form-data";
import { Request } from "express";

interface Options {
  URL: string | undefined;
}

class MediaStorage implements StorageEngine {
  private URL;

  constructor(opts: Options) {
    this.URL = opts.URL;
  }

  _handleFile(
    _req: Request,
    file: Express.Multer.File,
    cb: (error?: Error | null, info?: Partial<Express.Multer.File>) => void
  ): void {
    const fd = new FormData();

    fd.append("files", file.stream, { filename: file.originalname });

    axios
      .post(this.URL as string, fd, {
        headers: fd.getHeaders(),
      })
      .then((res: AxiosResponse) => {
        cb(null, {
          filename: res.data[0],
        });
      })
      .catch((_err) => {
        cb(_err);
      });

    //   console.log(file.stream.read());
    // });
  }

  _removeFile(
    _req: Request,
    _file: Express.Multer.File,
    _cb: (error: Error | null) => void
  ): void {
    // TODO: Remove from bucket if it fails
  }
}
export default (opts: Options): MediaStorage => new MediaStorage(opts);
