import rsa from './rsa';
import user from './user';

export default function(app){
    app.use('/rsa', rsa);
    app.use('/rsa/user', user);
}
