var express = require('express');
var cors = require('cors');
require('dotenv').config()
const multer = require('multer');

var app = express();

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/files');
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.originalname
    );
  },
});

const upload = multer(
  { storage: storage,
    fileFilter : (req, file, cb) => {
      if(file){
        cb(null, true);
      }else{
        cb(null, false);
        return cb(new Error("Invalid Entry"));
      }
    }
  }).single('upfile');

  app.post('/api/fileanalyse', function(req, res, next){
    upload(req, res, async function (err) {
      if(err){
          res.send('Not able to analyze');
      }else{
        const file = {
          name : req.file.originalname,
          type : req.file.mimetype,
          size : req.file.size
        }
        res.send(file);
      }
    });
  })


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
