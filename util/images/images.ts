import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
    cloud_name: 'dnsshs5nw',
    api_key: '569293864959236',
    api_secret: 'j-5C9C-S55hKgJ-GVgJO--wWAbw'
});

export function uploadImage() {
    cloudinary.uploader.upload("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==").then(res => console.log(res));
}
