const mysql = require('mysql');

export const users = (query : (sql: string) => Promise<any>) => {
    return {
        remove(userID: number, email: string): Promise<any> {
            return new Promise((res, rej) => {
                const newEmail = `${email}`.split('@').join(`+deleted-${new Date().getTime()}@`)
                const sql = `UPDATE users set email='${newEmail}' WHERE id= ${mysql.escape(userID)}`;
                query(sql).then((r) => res(r?.[0])).catch(rej)
            });
        },
        byEmail(email: string): Promise<any> {
            return new Promise((res, rej) => {
                const sql = `SELECT * FROM users WHERE email = ${mysql.escape(email)};`;
                query(sql).then((r) => res(r?.[0])).catch(rej)
            });
        },
        save(email: string, cpf?: string, first_name?: string, last_name?: string, photo?: string, googleID?: string, facebookID?: string, zip_code?: string, street_name?: string, street_number?: string, neighborhood?: string, city?: string, federal_unit?: string, password?: string): Promise<any> {
            return new Promise((res, rej) => {
                const sql = `INSERT INTO users (first_name, email, photo, googleID, facebookID, last_name, cpf, zip_code, street_name, street_number, neighborhood, city, federal_unit, password) VALUES(${mysql.escape(first_name)}, ${mysql.escape(email)}, ${mysql.escape(photo)}, ${mysql.escape(googleID)}, ${mysql.escape(facebookID)}, ${mysql.escape(last_name)}, ${mysql.escape(cpf)},${mysql.escape(zip_code)}, ${mysql.escape(street_name)}, ${mysql.escape(street_number)}, ${mysql.escape(neighborhood)}, ${mysql.escape(city)}, ${mysql.escape(federal_unit)}, ${mysql.escape(password)});`;
                query(sql).then(res).catch(rej)
            });
        },
        update: (userID: number, id_user_mercadopago?: string, first_name?: string, photo?: string, googleID?: string, facebookID?: string, last_name?: string, cpf?: string, zip_code?: string, street_name?: string, street_number?: string, neighborhood?: string, city?: string, federal_unit?: string) => {
            return new Promise((res, rej) => {
                const sql = `UPDATE users SET ${first_name ? `first_name=${mysql.escape(first_name)},`: ``}${photo ? `photo=${mysql.escape(photo)},`: ``}${googleID ? `googleID=${mysql.escape(googleID)},`: ``}${facebookID ? `facebookID=${mysql.escape(facebookID)},`: ``}${last_name ? `last_name=${mysql.escape(last_name)},`: ``}${cpf ? `cpf=${mysql.escape(cpf)},`: ``}${zip_code ? `zip_code=${mysql.escape(zip_code)},`: ``}${street_name ? `street_name=${mysql.escape(street_name)},`: ``}${street_number ? `street_number=${mysql.escape(street_number)},`: ``}${neighborhood ? `neighborhood=${mysql.escape(neighborhood)},`: ``}${city ? `city=${mysql.escape(city)},`: ``}${federal_unit ? `federal_unit=${mysql.escape(federal_unit)},`: ``}${id_user_mercadopago ? `id_user_mercadopago=${mysql.escape(id_user_mercadopago)},`: ``}updated_at=CURRENT_TIMESTAMP WHERE id = ${mysql.escape(userID)};`;
                query(sql).then(res).catch(rej)
            });
        },
        updatePassword: (userID: number, password: string) => {
            return new Promise((res, rej) => {
                const sql = `UPDATE users SET password=${mysql.escape(password)} WHERE id = ${mysql.escape(userID)};`;
                query(sql).then(res).catch(rej)
            });
        },
        updateRole: (userID: number, role: string) => {
            return new Promise((res, rej) => {
                const sql = `UPDATE users SET role=${mysql.escape(role)} WHERE id = ${mysql.escape(userID)};`;
                query(sql).then(res).catch(rej)
            });
        },
    }
}

