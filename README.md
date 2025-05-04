# ClimbNote 🧗‍♂️
A full-stack climbing tracker web app built with the MERN stack. ClimbNote helps users log completed routes, track their progress over time, and share their climbs with friends. Built to support individual logs, gym-based filtering, and social interaction among climbers.

## 🚀 Features
- 🔐 Multi-user authentication (JWT + bcrypt)
- 🧱 Route logging by type (bouldering, top-rope, sport), grade, and gym
- 📸 Photo uploads with AWS S3 integration
- 📊 Visual progress tracking through interactive dashboards
- 🌐 Support for NYC-based gym locations
- 🤝 Social sharing and log comparison with friends
- ⚙️ Automatic CI & deployment via Vercel

## 🛠️ Tech Stack
- **Frontend:** React, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **Auth:** JWT, bcrypt
- **Cloud Storage:** AWS S3
- **Deployment:** Vercel

## 📦 Installation

```bash
# Clone the repo
git clone https://github.com/yourusername/climbnote.git
cd climbnote

# Install dependencies
cd client && npm install
cd ../server && npm install

# Add your environment variables
touch .env
