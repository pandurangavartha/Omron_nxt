const multer = require('multer');
console.log("innnnnnnnnnnnnnnnnnn imgeeee")
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
//        console.log(file, "uploadsss")
//        cb(null, 'public/uploads')
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null,  Date.now() + '-' + file.originalname)
    }
})

const upload = multer({storage: storage})
var path = "public/bulkuploads";
const bulkStorage = multer.diskStorage({

    destination: function (req, file, cb) {
//        cb(null, 'public/bulkuploads')
        console.log("innnnnn, bulkuploadsss")
        cb(null, path)
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    },

})
const bulkupload = multer({storage: bulkStorage});
//blogs upload
const blogsStorage = multer.diskStorage({

    destination: function (req, file, cb) {
        cb(null, 'public/blogs')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})
const blogsUpload = multer({storage: blogsStorage});

module.exports = {
    upload,
    bulkupload,
    blogsUpload
}