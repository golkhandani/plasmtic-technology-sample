import * as Busboy from "busboy";

export const multipartParser = (event): Promise<{ content: any }> => {
    return new Promise((resolve, reject) => {
        const busboy = new Busboy({
            headers: {
                'content-type':
                    event.headers['content-type'] || event.headers['Content-Type']
            },

        });

        const uploadFile: any = {}
        busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {

            console.log('File [' + fieldname + ']: filename: ' + filename);

            file.on('data', function (data) {
                uploadFile.content = data
                console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
            });

            file.on('end', function () {
                console.log('File [' + fieldname + '] Finished');
            });
        });

        busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated) {
            console.log('Field [' + fieldname + ']: value: ' + val);
        });

        busboy.on('finish', async function () {
            console.log('Done parsing form!');
            resolve(uploadFile)
        });

        busboy.write(event.body, event.isBase64Encoded ? 'base64' : 'binary')
        busboy.end()
    })

}
