const mongoose = require('mongoose');
const ProfileSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    phone: { type: String },
    role: { type: String }
});
//jjj
module.exports = Profile = mongoose.model('profile', ProfileSchema);