import multer from 'multer';

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/images/questions')
  },
  filename: (req, file, cb) => {
    cb(null,  Date.now() + file.originalname)
  }
})
export default fileStorage