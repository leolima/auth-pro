import * as restify from 'restify'
import { BadRequestError } from 'restify-errors'
import { Router } from '../common/router'
import { authenticate, register } from '../security/auth.handler'
import { authorize } from '../security/auth.verify'
import { validaCpfCnpj } from '../common/utils'
import db from '../db/mysql'
import * as bcrypt from 'bcrypt'

class UsersRouter extends Router {
    constructor() {
        super();
    }

    applyRoutes(application: restify.Server) {
        application.post('/login', authenticate)
        application.post('/register', register)
        application.put('/users', [authorize(), (req, res, next) => {
            const { id_user_mercadopago, first_name, photo, googleID, facebookID, last_name, cpf, zip_code, street_name, street_number, neighborhood, city, federal_unit } = req.body || {}
            const userID = req.authenticated.id;
            const cpfParsed = `${cpf}`.replace(/\D/g, "");

            if(cpfParsed && !validaCpfCnpj(cpfParsed))
                return next(new BadRequestError('CPF inválido!'));

            db.users().update(userID, id_user_mercadopago, first_name, photo, googleID, facebookID, last_name, cpfParsed, zip_code, street_name, street_number, neighborhood, city, federal_unit).then((r: any) => {
                res.json({ id: userID, id_user_mercadopago, first_name, photo, googleID, facebookID, last_name, cpfParsed, zip_code, street_name, street_number, neighborhood, city, federal_unit, message: 'Usuário alterado com sucesso!'})
            }).catch(next)
        }])
        application.put('/change-role', [authorize('ADMIN'), (req, res, next) => {
            const { role, userID } = req.body || {}

            if(!role && !userID)
                return next(new BadRequestError('userId e role são obrigatórios'));

            if(!['USER', 'FREE'].includes(role))
                return next(new BadRequestError('role só pode ser USER ou FREE'));

            db.users().updateRole(userID, role).then((r: any) => {
                if(r.affectedRows) {
                    res.json({ message: 'Usuário alterado com sucesso!'})
                } else {
                    res.statusCode = 400;
                    res.json({ message: 'Usuário não encontrado'})
                }
            }).catch(next)
        }])
        application.del('/users', [authorize(), (req, res, next) => {
            const userID = req.authenticated.id;
            db.users().remove(userID, req.authenticated.email).then(r => res.json(r)).catch(next)
        }])
      
    }
}

export const usersRouter = new UsersRouter()