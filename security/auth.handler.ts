import * as restify from 'restify'
import * as jwt from 'jsonwebtoken'
import { BadRequestError, NotAuthorizedError } from 'restify-errors'
import { environment } from '../common/environment'
import db from '../db/mysql'
import { emailRegex, validaCpfCnpj } from '../common/utils'
import * as bcrypt from 'bcrypt';


/**
 * Login method
 */
export const authenticate: restify.RequestHandler = (req, resp, next) => {
    const { email } = req.body || {}
    db.users().byEmail(email).then(user => {
        if(user && !`${email}`.includes('deleted')) {
            const token = jwt.sign({ sub: user.email, iss: 'sei-api' }, environment.security.apiSecret)
            resp.json({...user, accessToken: token })
        } else {
            return next(new NotAuthorizedError('Credenciais inválidas!'));
        }
    }).catch(next)
}


export const register: restify.RequestHandler = (req, resp, next) => {
    const { first_name, last_name, cpf, email, photo, googleID, facebookID, zip_code, street_name, street_number, neighborhood, city, federal_unit, password } = req.body || {}
    const cpfParsed = `${cpf}`.replace(/\D/g, "");
    let hashPass = null;
    if(!new RegExp(emailRegex).exec(email))
        return next(new BadRequestError('Email inválido!'));

    if(cpfParsed && !validaCpfCnpj(cpfParsed))
        return next(new BadRequestError('CPF inválido!'));

    if(password){
        const salt = bcrypt.genSaltSync(10);
        hashPass = bcrypt.hashSync(password, salt);
    }
    
    db.users().save(email, cpf, first_name, last_name, photo, googleID, facebookID, zip_code, street_name, street_number, neighborhood, city, federal_unit, hashPass).then((result) => {
        if (result.affectedRows) {
            const token = jwt.sign({ sub: email, iss: 'sei-api' }, environment.security.apiSecret)
            resp.json({message: 'Usuário registrado com sucesso!', id: result.insertId, first_name, last_name, cpf, email, photo, googleID, facebookID, zip_code, street_name, street_number, neighborhood, city, federal_unit, accessToken: token })
        }
    }).catch(next)
}