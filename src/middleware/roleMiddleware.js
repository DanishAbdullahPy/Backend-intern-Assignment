const role = (roles) => {
    return (req, res, next) => {
        console.log('Authenticated User:', req.user); // Debug log for user data
        console.log('Allowed Roles:', roles); // Debug log for allowed roles

        // Check if the user is authenticated and has a valid role
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Access denied: insufficient permissions' });
        }

        // If the user role is allowed, proceed to the next middleware or route
        next();
    };
};

module.exports = { role };
