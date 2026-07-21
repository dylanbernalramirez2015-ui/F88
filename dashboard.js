require('dotenv').config();

const express = require('express'); // 👈 FALTABA ESTO
const session = require('express-session');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;

const app = express();

// 🔐 CONFIG
const config = {
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "http://localhost:3000/callback",
  scopes: ['identify', 'guilds']
};

// 🧠 PASSPORT
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

passport.use(new DiscordStrategy(config, (accessToken, refreshToken, profile, done) => {
  return done(null, profile);
}));

// 🍪 SESSION
app.use(session({
  secret: 'supersecret',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// 🔑 LOGIN
app.get('/login', passport.authenticate('discord'));

// 🔁 CALLBACK
app.get('/callback',
  passport.authenticate('discord', { failureRedirect: '/' }),
  (req, res) => res.redirect('/dashboard')
);

// 🚪 LOGOUT
app.get('/logout', (req, res) => {
  req.logout(() => {});
  res.redirect('/');
});

// 🏠 HOME
app.get('/', (req, res) => {
  res.send(`
    <h1>🔥 Dashboard PRO</h1>
    <a href="/login">Iniciar con Discord</a>
  `);
});

// 🛡️ PANEL
app.get('/dashboard', (req, res) => {
  if (!req.user) return res.redirect('/');

  res.send(`
    <h1>Bienvenido ${req.user.username}</h1>
    <p>Servidores: ${req.user.guilds.length}</p>
    <a href="/logout">Cerrar sesión</a>
  `);
});

// 🚀 START
app.listen(3000, () => {
  console.log('🌐 Dashboard PRO en http://localhost:3000');
});