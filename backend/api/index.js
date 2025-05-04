import express, { query } from 'express';
import cors from 'cors';
import mongoose from "mongoose";
import dotenv from "dotenv";
import GymStatus from '../models/gym.mjs'
import authRoutes from "../routes/authRoutes.mjs";
import Climb from '../models/climb.mjs'
import User from '../models/user.mjs'
import jwt from 'jsonwebtoken';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import AWS from 'aws-sdk';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const app = express();
const PORT = process.env.backPORT || 5001;

const uri = process.env.MONGO_URI;
console.log(uri);
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on("connected", () => console.log("Connected to MongoDB"));
mongoose.connection.on("error", (err) =>
console.error("MongoDB connection error:", err)
);

app.use(
    cors({
      origin: `${process.env.FRONT_PORT}`,
      credentials: true,
    })
  );
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Routes for auth
app.use("/api/auth", authRoutes);

const s3 = new AWS.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      const filename = `climbs/${Date.now()}-${file.originalname}`;
      cb(null, filename);
    }
  })
});

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);
  console.log(token);
  jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403).json({error: err});
    req.user = user; // attach decoded payload
    next();
  });
};

app.get('/', async(req, res)=>{
  res.send("hi")
})

app.post('/gym', async(req, res)=>{
    console.log(req.body)
    const {gym} = req.body;
    try {
        const result = await GymStatus.findOneAndUpdate(
          { _id: 'current_gym' },              
          { gym, lastUpdated: new Date() },    
          { upsert: true, new: true }
        );
    
        res.json({ message: 'Gym updated', data: result });
      } catch (err) {
        res.status(500).json({ error: 'Failed to update gym' });
      }
});

app.get('/getCurrentGym', async (req, res)=>{
    try{
        const current = await GymStatus.findOne(
            {_id: 'current_gym'}
        );
        res.json(current.gym);
        console.log(current.gym);
    }catch (err){
        res.status(500).json({error: 'Failed to get gym'});
    }
})

app.post('/upload-climb', upload.single('image'), async (req, res) => {
  try {
    const { userId, gym, grade, style, username, notes } = req.body;
    const styles = style.split(',');
    const imageUrl = req.file?.location; // multer-s3 automatically adds .location

    const newClimb = new Climb({
      userId,
      gym,
      grade,
      style: styles,
      image: imageUrl,
      date: new Date(),
      username,
      notes
    });

    await newClimb.save();
    res.status(201).json({ message: 'Climb logged', climb: newClimb });

  } catch (err) {
    console.error('Upload failed', err);
    res.status(500).json({ error: 'Failed to log climb' });
  }
});



app.get('/climbs', async(req, res)=>{
  const {gym, grade, styles} = req.query;
  try{
    let query = {};
    if (gym) query.gym = gym;
    if (grade) query.grade = grade;
    if (styles) query.style = styles;

    const climbs = await Climb.find(query).sort({date: -1});
    res.json(climbs);
  }catch (error){
    res.status(500).json({error: 'Failed to get climbs'});
  }
})

app.get('/climbs/count', async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Missing username' });
  }

  const user = await User.findOne({ username });
  if (!user) {
    console.log('user not found');
    return res.status(404).json({ error: 'User not found' });
  }

  const total = await Climb.countDocuments({ userId: user._id });
  res.json({ total });
});

app.get('/myclimbs', async (req, res) => {
  const { username } = req.query;

  if (!username) {
    return res.status(400).json({ error: 'Missing username' });
  }

  const user = await User.findOne({ username });
  if (!user) {
    console.log('user not found');
    return res.status(404).json({ error: 'User not found' });
  }

  const climbs = await Climb.find({ userId: user._id }).sort({ date: -1 }); // most recent first
  res.json(climbs);
});

app.get('/users/me', authenticateToken, async (req, res) => {
  try {
    console.log(req.user.userId);
    const user = await User.findById(req.user.userId).select('-passwordHash');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.put('/users/me', authenticateToken, async(req, res)=>{
  try{
    const {username, email, height, armSpan, age} = req.body;
    const result = await User.findByIdAndUpdate(
      req.user.userId,
      {
        username,
        email,
        height,
        age,
        armSpan
      },
      { upsert: true, new: true }
    )
    return res.status(201).json({message: "Profile updated", user: result})
  }catch (err){
    res.status(500).json({error: 'Failed to update profile'})
  }

})



export const startServer = () => {
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
};

startServer();

export default app;

