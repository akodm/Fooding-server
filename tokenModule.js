const jwt = require("jsonwebtoken");
const { models } = require("./sequelize");

const User = models.user;

const { 
    JWT_KEY, 
    REF_KEY, 
    EXPIRESIN, 
    REF_EXPIRESIN, 
} = process.env;

function jwtFunction () {
    
    // access token generator - login request and refresh request
    this.access = (req) => {
        try {
            const { id, email } = req.user ? req.user : req.query;
            const salt = randonStr();

            const payload = {
                id, email, salt
            };

            const sign = jwt.sign(payload, JWT_KEY, { expiresIn : EXPIRESIN });

            if(!sign) { 
                return false;
            }

            const result = `Bearer ${sign}`;

            return result;
        } catch(err) {
            return false
        }
    }

    // refresh token generator - login request
    this.refresh = async (req) => {
        try {
            const { id, email } = req.query;
            const salt = randonStr();

            const payload = {
                id, email, salt
            };

            const sign = jwt.sign(payload, REF_KEY, { expiresIn : REF_EXPIRESIN });
            const access_token = this.access(req);

            if(!sign || !access_token) { 
                return false;
            }

            await User.update({
                refresh : `Bearer ${sign}`,
                access : access_token
            }, {
                where : {
                    id, email
                }
            });

            return access_token;
        } catch(err) {
            return false;
        }
    }

    /**
     *  access token verify
     *  success => req.user + => next();
     *  fail => refresh token verify
     */
    this.accessVerify = (req, res, next) => {
        try {
            const token = req.headers['authorization'];

            if(!token) { 
                return next("err"); 
            }
            
            const verify_result = verify(token, false, false);

            if(!verify_result) { 
                throw { 
                    message : "expireAll" 
                }; 
            }

            req.user = {
                id : verify_result.id,
                email : verify_result.email
            };

            return next();
        } catch(err) {
            this.refreshVerify(req, res, next);
        }
    }

    /**
     *  refresh token verify
     *  success => req.user + => next();
     *  fail => err.message : expireAll => next(err);
     *  res.send("expireAll");
     */
    this.refreshVerify = async (req, res, next) => {
        try {
            const token = req.headers['authorization'];
           
            let user = null;

            if(!token) { 
                return next("err"); 
            }

            const verify_result = verify(token, false, true);

            if(!verify_result || !verify_result.email || !verify_result.id) { 
                throw { 
                    message : "expireAll" 
                }; 
            }

            try {
                user = await User.findOne({
                    where : {
                        id : verify_result.id,
                        email : verify_result.email,
                        access : token
                    }
                });
            } catch(error) {
                return next(error);
            }

            let refresh_result = null;
            if(user && user.dataValues) {
                const { refresh } = user.dataValues;

                refresh_result = verify(refresh, true, false);

                if(!refresh_result) {
                    throw {
                        message : "expireAll"
                    };
                }
            } else {
                return next("err");
            }

            req.user = {
                id : refresh_result.id,
                email : refresh_result.email
            };

            const access_sign = this.access(req);

            if(!access_sign) {
                throw {
                    message : "err"
                };
            }

            try {
                await User.update({
                    access : access_sign
                }, {
                    where : {
                        id : refresh_result.id,
                        email : refresh_result.email
                    }
                });
            } catch(error) {
                return next(error);
            }

            req.user.token = access_sign;

            return next();
        } catch(err) {
            err.message = "expireAll";
            return next(err);
        }
    }

    function verify (token, refresh, ignore) {
        try {
            const key = refresh ? REF_KEY : JWT_KEY;

            const token_value = token.split("Bearer")[1].trim();

            const result = jwt.verify(token_value, key, { ignoreExpiration : ignore });

            if(result) return result;
        } catch(err) {
            console.log((refresh ? "refresh " : "access ") + "token expire : ", err.message);
        }
        return false;
    }

    function randonStr () {
        const str = Math.random().toString(36).substr(2,8);

        return str;
    }
}

module.exports = jwtFunction;