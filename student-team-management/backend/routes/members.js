const express = require('express');
const cors = require('cors');
const multer = require('multer');
const Member = require('../models/Member');
const router = express.Router();

// Enable CORS for frontend (localhost:3000)
const corsOptions = {
  origin: 'http://localhost:3000', // your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
};

const app = express();
app.use(cors(corsOptions));  // Use CORS middleware globally

// Your existing multer configuration and routes
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage: storage });

router.post('/', upload.single('image'), async (req, res) => {
  const { name, role, email } = req.body;
  const newMember = new Member({
    name,
    role,
    email,
    image: req.file.filename,
  });
  await newMember.save();
  res.status(201).json(newMember);
});

router.get('/', async (req, res) => {
  const members = await Member.find();
  res.json(members);
});

router.get('/:id', async (req, res) => {
  const member = await Member.findById(req.params.id);
  res.json(member);
});

module.exports = router;
