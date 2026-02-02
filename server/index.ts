import express from "express";
import { createServer } from "http";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import session from "express-session";
import MemoryStore from "memorystore";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);

// Simple in-memory user store for development
const users: any[] = [{ id: "1", username: "admin", password: "admin" }];

// Session middleware
const SessionStore = MemoryStore(session);
app.use(
    session({
        store: new SessionStore({ checkPeriod: 86400000 }),
        secret: process.env.SESSION_SECRET || "dev-secret",
        resave: false,
        saveUninitialized: false,
        cookie: { secure: process.env.NODE_ENV === "production" },
    }),
);

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = users.find((u) => u.username === username);
            if (!user) {
                return done(null, false, {
                    message: "Invalid username or password",
                });
            }
            if (user.password !== password) {
                return done(null, false, {
                    message: "Invalid username or password",
                });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }),
);

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
    try {
        const user = users.find((u) => u.id === id);
        done(null, user || null);
    } catch (error) {
        done(error);
    }
});

// Middleware
app.use(express.json());
app.use(express.static(join(__dirname, "../dist/public")));

// Routes
app.post("/api/login", passport.authenticate("local"), (req, res) => {
    res.json(req.user);
});

app.post("/api/logout", (req, res) => {
    req.logout(() => {
        res.json({ message: "Logged out" });
    });
});

app.get("/api/user", (req, res) => {
    if (req.isAuthenticated()) {
        res.json(req.user);
    } else {
        res.status(401).json({ message: "Not authenticated" });
    }
});

app.post("/api/register", async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = users.find((u) => u.username === username);

        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const newUser = { id: String(users.length + 1), username, password };
        users.push(newUser);
        res.json(newUser);
    } catch (error) {
        res.status(500).json({ message: "Registration failed" });
    }
});

// Serve React app for all other routes
app.get("*", (req, res) => {
    res.sendFile(join(__dirname, "../dist/public/index.html"));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
