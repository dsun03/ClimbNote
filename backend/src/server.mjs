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
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

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
      origin: 'https://climbing-tracker-vercel-frontend.vercel.app',
      credentials: true,
    })
  );
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// Routes for auth
app.use("/api/auth", authRoutes);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
       cb(null, 'public/uploads')
 },
  filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
  }
  });

const upload = multer({ storage: storage });

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
    const { userId, gym, grade, style, username } = req.body;
    const styles = style.split(',');
    console.log('username is',username);
    console.log(styles)
    // Check if image exists
    if (!req.file) {
      const newClimb = new Climb({
        userId,
        gym,
        grade,
        style:styles,
        date: new Date(),
        username
      });
  
      await newClimb.save();
  
      return res.status(201).json({ message: 'Climb logged', climb: newClimb });
    }

    // Construct image path to serve it publicly
    const imagePath = `/uploads/${req.file.filename}`;

    const newClimb = new Climb({
      userId,
      gym,
      grade,
      style,
      image: imagePath, // Save image path in the DB
      date: new Date(),
      username
    });

    await newClimb.save();

    res.status(201).json({ message: 'Climb logged', climb: newClimb });

  } catch (err) {
    console.error('Failed to save climb', err);
    res.status(500).json({ error: 'Failed to save climb' });
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

