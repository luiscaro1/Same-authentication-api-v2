import multer from "multer";
import MediaStorage from "@/Storage/MediaStorage";
import Injectable from "@/Decorators/Injectable";

@Injectable("upload")
class Upload {
  private up: multer.Multer;

  constructor() {
    this.up = multer({
      storage: MediaStorage({
        URL: process.env.MEDIA,
      }),
    });
  }

  public get upload(): multer.Multer {
    return this.up;
  }
}

export default Upload;
