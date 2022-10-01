import { ImageType } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
    cloud_name: 'dnsshs5nw',
    api_key: '569293864959236',
    api_secret: 'j-5C9C-S55hKgJ-GVgJO--wWAbw'
});

type UploadImageOptions = {
    type: ImageType;
    base64: string;
}
export async function upload({
    base64, type
}: UploadImageOptions) {
    const res = await cloudinary.uploader.upload(`data:image/${type};base64,${base64}`);
    console.log(res);
    return res.url;
}