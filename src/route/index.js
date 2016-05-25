import rsa from './rsa';

export default function(app){
    app.use('/rsa', rsa);
}
