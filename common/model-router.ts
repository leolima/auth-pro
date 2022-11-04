import * as mongoose from 'mongoose'
import { NotFoundError } from 'restify-errors'
import { Router } from './router'


export abstract class ModelRouter<D extends mongoose.Document> extends Router {
    constructor(protected model: mongoose.Model<D>) {
        super()
    }

    validateId = (req, resp, next) => {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            next(new NotFoundError('Document not found'))
        } else {
            next()
        }
    }

    /**
     * Get All documents
     */
    findAll = (req, resp, next) => {
        this.model.find()
            .then(this.renderAll(resp, next))
            .catch(next)
    }

    /**
     * Find document by id
     */
    findById = (req, resp, next) => {
        this.model.findById(req.params.id)
            .then(this.render(resp, next))
            .catch(next)
    }

    /**
     * Save a new Document
     */
    save = (req, resp, next) => {
        let document = new this.model(req.body)
        document.save()
            .then(this.render(resp, next))
            .catch(next)
    }

    /**
     * Replace Document
     */
    replace = (req, resp, next) => {
        const options = { runValidators: true }
        this.model.replaceOne({ _id: req.params.id }, req.body, options)
            .then(result => {
                if (result.matchedCount) {
                    this.model.findById(req.params.id).then(this.render(resp, next))
                } else {
                    throw new NotFoundError('Document not found!')
                }
            })
            .catch(next)
    }

    /**
     * Update a Document
     */
    update = (req, resp, next) => {
        const options = { new: true, runValidators: true }
        this.model.findByIdAndUpdate(req.params.id, req.body, options)
            .then(this.render(resp, next))
            .catch(next)
    }

    /**
     * Delete a Document
     */
    delete = (req, resp, next) => {
        this.model.deleteOne({ _id: req.params.id })
            .then(result => {
                if (result.deletedCount) {
                    resp.send(204)
                } else {
                    throw new NotFoundError('Document not found!')
                }
                return next()
            })
            .catch(next)
    }
}