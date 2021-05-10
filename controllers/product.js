const Product = require("../models/product")
const formidable = require("formidable");
const _ = require("lodash");
const fs= require("fs")

const {errorHandler} = require("../helpers/dbErrorHandler");

// exports.create = (req, res) => {
//     let form = new formidable.IncomingForm();
//     form.keepExtensions = true;
//     form.parse(req, (err, fields, files) => {
//         if (err) {
//             return res.status(400).json({
//                 error: 'Image could not be uploaded'
//             });
//         }
//         // check for all fields
//         const { name, description, price, category, quantity, shipping } = fields;

//         if (!name || !description || !price || !category || !quantity || !shipping) {
//             return res.status(400).json({
//                 error: 'All fields are required'
//             });
//         }

//         let product = new Product(fields);

//         // 1kb = 1000
//         // 1mb = 1000000

//         if (files.photo) {
//             // console.log("FILES PHOTO: ", files.photo);
//             if (files.photo.size > 1000000) {
//                 return res.status(400).json({
//                     error: 'Image should be less than 1mb in size'
//                 });
//             }
//             product.photo.data = fs.readFileSync(files.photo.path);
//             product.photo.contentType = files.photo.type;
//         }

//         product.save((err, result) => {
//             if (err) {
//                 console.log('PRODUCT CREATE ERROR ', err);
//                 return res.status(400).json({
//                     error: errorHandler(err)
//                 });
//             }
//             res.json(result);
//         });
//     });
// };

exports.productById = (req, res, next, id) =>{
    Product.findById(id).exec((err, product)=>{
        if (err || !product){
            return res.status(400).json({
                error:"Product not found"
            })
        }
        req.product=product  
        next();
    });
};

exports.read = (req, res) => {
    req.product.photo= undefined
    return res.json(req.product)
}

exports.create = (req, res) => {

    const form = new formidable.IncomingForm();
    form.keepExrensions=true

    form.parse(req, (err, fields, files)=> {
        if(err){
            return res.status(400).json({
                error:'Image failed to upload'
            })
        }

        //check for all fields data
        const {name, description, price, category, quantity, shipping}=fields

        if (!name || !description || !price || !category || !quantity || !shipping){
            return res.status(400).json({
                error: "All fields are requied"
            });
        }

        let product = new Product(fields)



        if(files.photo){
            if (files.photo.size>1000000) {
                return res.status(400).json({
                    error: 'Image cannot be >1mb size'
                })
            }
            product.photo.data= fs.readFileSync(files.photo.path)
            product.photo.contentType=files.photo.type
        }

        product.save((err, result)=> {
            if (err){
                return res.status(400).json({
                    error:errorHandler(err)
                })
            }
            console.log("Success")
            res.json(result);
        });

    });


};

exports.remove = (req, res) => {
    let product = req.product 
    product.remove((err, deletedProduct)=>{
        if (err) {
            res.status(400).json({
                error: errorHandler(err)
            });
        };
        res.json({
            
            "message":"Product deleted successfully"
        })
    }) 
}

exports.update = (req, res) => {

    const form = new formidable.IncomingForm();
    form.keepExrensions=true

    form.parse(req, (err, fields, files)=> {
        if(err){
            return res.status(400).json({
                error:'Image failed to upload'
            })
        }

        //check for all fields data
        const {name, description, price, category, quantity, shipping}=fields

        if (!name || !description || !price || !category || !quantity || !shipping){
            return res.status(400).json({
                error: "All fields are requied"
            });
        }

        let product = req.product;

        product=_.extend(product, fields)

        if(files.photo){
            if (files.photo.size>1000000) {
                return res.status(400).json({
                    error: 'Image cannot be >1mb size'
                })
            }
            product.photo.data= fs.readFileSync(files.photo.path)
            product.photo.contentType=files.photo.type
        }

        product.save((err, result)=> {
            if (err){
                return res.status(400).json({
                    error:errorHandler(err)
                })
            }
            console.log("Success")
            res.json(result);
        });

    });


};


//sell or arrival query

//products?sortBy=sold&order=desc&limit=4
//products?sortBy=createdAt&order=desc&limit=4
//if there are no params, we return all products in random order

exports.list= (req, res)=> {
    let order = req.query.order ? req.query.order : 'asc'
    let sortBy = req.query.sortBy ? req.query.sortBy : '_id'
    let limit = req.query.limit ? parseInt(req.query.limit) : 2

    Product.find()
        .select("-photo")
        .populate('category')
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, data)=> {
            if (err) {
                return res.status(400).json({
                    error: 'Product not found'
                })
            }
            res.json(data)
        })

}

exports.listRelated = (req, res) =>{
    
    let limit = req.query.limit ? parseInt(req.quer.limit) : 6;

    Product.find(
        {_id: {$ne:req.product}, category: req.product.category}
    ).limit(limit)
    .populate('category', '_id','name')
    .exec((err, products)=>{
        if (err) {
            return res.status(400).json({
                error: 'Related Products not found'
            })
        }
        res.json(products)
    })

}

exports.listCategories = (req, res)=>{
    Product.distinct("category", {}, (err, categories)=>{
        if (err) {
            return res.status(400).json({
                error: 'CATEGORIES not found'
            })
        }
        res.json(categories)
    })
}