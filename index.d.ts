import * as restify from 'restify'

declare module 'restify' {
    export interface Request {
        authenticated: {
            first_name: string,
            last_name: string,
            email: string,
            cpf: string,
            zip_code: string,
            street_name: string,
            street_number: string,
            neighborhood: string,
            city: string,
            federal_unit: string,
            profiles: any,
            id: number,
            id_user_mercadopago: string
            role: string
        }
    }
}