const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authConfig = require('../config/auth.json')

function generateToken(params = {}) {
    // passa algo unico do usuario e um hash unico para identificar a aplicação
    return jwt.sign(params, authConfig.secret, {
        // token expira em 1 dia
        expiresIn: 86400,
    });
}

module.exports ={
    async register(req, res) {
        const { email } = req.body;
        try{
            if(await User.findOne({ email })){
                return res.status(400).send({ error: 'Email alredy exists'})
            }
            // create é do proprio mongodb
            const user = await User.create(req.body);
            
            // para que a senha não seja mostrada no send user
            user.password = undefined;

            res.send({ 
                user, 
                token : generateToken({ id: user.id })
            });
        }catch (err) {
            return res.status(400).send({ error: 'Resgistration failed', err});
        }
    },

    async autenticate(req, res) {
        const { email, password } = req.body;
        // o select() indica que o parametro password venha junto para validar com o token
        const user = await User.findOne({ email }).select('+password')

        if(!user){
            return res.status(400).send({ error: 'User not found' });
        }

        if(!await bcrypt.compare(password, user.password)){
            return res.status(400).send({ error: 'Invalid password'});
        }

        // para que a senha não seja mostrada no send user
        user.password = undefined;

        res.send({ 
            user, 
            token : generateToken({ id: user.id })
        });
    }
    
}