const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(cors());


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.log('MongoDB connection error:', err));

const User = mongoose.model('User', new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
    password: { type: String, required: true, minlength: 8 },
    phone: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    isAdmin: { type: Boolean, default: false },
}));


const authenticate = async (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Access denied. No token provided.' });

    try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET); 
        req.user = decoded;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};



app.post('/api/user/register', [
    body('email').isEmail(),
    body('password').isLength({ min: 8 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password, phone } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already registered.' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ name, email, password: hashedPassword, phone });
        await user.save();

        res.status(201).json({ message: 'User registered successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
});


app.post('/api/user/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !user.isActive) return res.status(400).json({ message: 'Invalid email or password.' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid email or password.' });

        const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
});


app.get('/api/user/profile', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found.' });

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
});


app.put('/api/user/profile', authenticate, async (req, res) => {
    const { name, phone } = req.body;

    try {
        const user = await User.findByIdAndUpdate(req.user.id, { name, phone }, { new: true }).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found.' });

        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
});


app.delete('/api/user/deactivate', authenticate, async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.user.id, { isActive: false }, { new: true });
        if (!user) return res.status(404).json({ message: 'User not found.' });

        res.json({ message: 'Account deactivated successfully.' });
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
});


app.get('/api/admin/users', authenticate, async (req, res) => {
    if (!req.user.isAdmin) return res.status(403).json({ message: 'Access denied.' });

    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server error.' });
    }
});


app.get('/', (req, res) => {
    res.send('Welcome to the User Management System API! Use /api/user or /api/admin endpoints.');
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
