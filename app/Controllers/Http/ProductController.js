'use strict'
const Database = use('Database');
const sanitize = use('sqlstring');
const { validate } = use('Validator');

class ProductController {
    async index({view, auth, request, response}){
        let pageRows = request.all().hasOwnProperty('rows') ? parseInt(request.all().rows) : 10;
        let start = request.all().hasOwnProperty('page') ? ((parseInt(request.all().page) - 1) * pageRows) : 0;       
        try{
            let allProducts = await Database.raw(`
            SELECT *, DATE_FORMAT(products.updated_at, '%m-%d-%y') as updated_at, DATE_FORMAT(products.created_at, '%m-%d-%y') as created_at FROM products ORDER BY title ASC LIMIT ${start}, ${pageRows}    
            `);
            allProducts = allProducts[0];
            let tableRows = await Database.raw(`
            SELECT COUNT("id") as tableRows FROM products
            `);
            tableRows = tableRows[0][0].tableRows;
            let totalPages = tableRows > pageRows ? Math.ceil(tableRows / pageRows) : 1;
            let arrayOfPages = [];
            let i = 0;
            for(i=0;i<totalPages;i++){
                arrayOfPages.push(i + 1);
            }
            // return arrayOfPages;
            return view.render('admin/products/all_products.edge',{ 
                allProducts,
            currentPage: request.all().hasOwnProperty('page') ? parseInt(request.all().page) : 1,
             arrayOfPages,
             totalPages,
             pageRows
        });
        } catch(error){
            console.log(error);
            return response.redirect('back');
        }
    // index({view}){
    //     const products = [1,2,3,4,5,6,7,8,9,10];
    //     return view.render('products/all', {products});
    // }
    // newArrivals({view}){
    //     const products = [1,2,3,4,5,6,7,8,9,10];
    //     return view.render('products/all', {products});
    // }
    // show({view}){
    //     return view.render('products/single');
    // }
}


module.exports = ProductController
