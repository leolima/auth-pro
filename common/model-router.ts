import * as mongoose from 'mongoose'
import { NotFoundError } from 'restify-errors'
import { Router } from './router'


export abstract class ModelRouter<D extends mongoose.Document> extends Router {
    basePath: string
    pageSize: number = 2

    constructor(protected model: mongoose.Model<D>) {
        super()
        this.basePath = `/${ model.collection.name }`
    }

    /**
     * Customizing the response with hypermedia
     */
    envelope(document: any): any {
        let resource = Object.assign({ _links: {} }, document.toJSON())
        resource._links.self = `${ this.basePath }/${ resource._id }`

        return resource
    }

    /**
     * Customizing the response with hypermedia
     */
    envelopeAll(documents: any[], options: any = {}): any {
        const resource: any = {
            _links: {
                self: `${ options.url }`,
            },
            items: documents,
        }
        if (options.page && options.count && options.pageSize) {
            if (options.page > 1) {
                resource._links.previous = `${ this.basePath }?_page=${ options.page - 1 }`
            }
            const remaining = options.count - options.page * options.pageSize
            if (remaining > 0) {
                resource._links.next = `${ this.basePath }?_page=${ options.page + 1 }`
            }
        }
        return resource
    }


    /**
     * Checks the id before pass to mongo
     */
    validateId = (req, resp, next) => {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            next(new NotFoundError('Document not found'))
        } else {
            next()
        }
    }

    /**
     * Get All documents with filters and pagination
     */
    findAll = (req, resp, next) => {
        let page = parseInt(req.query.page || 1)
        page = page > 0 ? page : 1
        const skip = (page - 1) * this.pageSize
        this.model
            .countDocuments(req.query || null)
            .exec()
            .then((count) => {
                this.model
                    .find(req.query || null)
                    .skip(skip)
                    .limit(this.pageSize)
                    .then(
                        this.renderAll(resp, next, {
                            page,
                            count,
                            pageSize: this.pageSize,
                            url: req.url,
                        })
                    )
            }
            )
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