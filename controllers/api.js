const APIError = require('../rest').APIError;
const model = require('../model');

let 
    Example = model.Example,
    Category = model.Category;

module.exports = {
    'GET /api/category/list': async (ctx, next) => {
        var categorys = await Category.findAll({
            order: 'sort'
        });
        ctx.rest({
            categorys: categorys
        });
    },

    'POST /api/category/save': async (ctx, next) => {
        var t = ctx.request.body;
           
        if (!t.name || !t.name.trim()) {
            throw new APIError('错误的输入', '名称不能为空');
        }
        var category = await Category.create({
            name: t.name.trim(),
            sort: t.sort
        });
        ctx.rest(category);
    },

    'PUT /api/category/update/:id': async (ctx, next) => {
        var t = ctx.request.body;
        if (!t.name || !t.name.trim()) {
            throw new APIError('错误的输入', '名称不能为空');
        }
        var category = await Category.findAll({
            where: {
                id: ctx.params.id
            }
        });
        if (!category) {
            throw new APIError('notfound', '没有找到这个id的分类: ' + ctx.params.id);
        }
        for(let tmp of category){
            tmp.name = t.name.trim();
            tmp.sort = t.sort;
            await tmp.save();
        }
        ctx.rest(category);
    },

    'DELETE /api/category/delete/:id': async (ctx, next) => {
        var category = await Category.findAll({
            where: {
                id: ctx.params.id
            }
        });
        if (!category) {
             throw new APIError('notfound', '没有找到这个id的分类: ' + ctx.params.id);
        }
        for(let tmp of category){
            await tmp.destroy();
        }
        ctx.rest(category);
    },

    
    'GET /api/example/list': async (ctx, next) => {
        var examples = await Example.findAll();
        ctx.rest({
            examples: examples
        });
    },

    'GET /api/example/list/:id': async (ctx, next) => {
        var examples = await Example.findAll({
            where: {
                category: ctx.params.id
            }
        });
        ctx.rest({
            examples: examples
        });
    },

    'GET /api/example/search/:keyword': async (ctx, next) => {
        var keyword = ctx.params.keyword;
        var categoryid = "";
        var tag = keyword;
        if(keyword.indexOf("-") != -1){
            var categoryname = keyword.split("-")[0];
            tag = keyword.split("-")[1];
            var category = await Category.findAll({
                where: {
                    name: {
                        $like: "%"+categoryname+"%"
                    }
                }
            });
            if(category){
                categoryid = category[0].id;
            }
        }
        var where = {
            where: {
                tag: {
                    $like: "%"+tag+"%"
                }
            }
        }
        if(categoryid){
            where = {
                where: {
                    category: categoryid,
                    tag: {
                        $like: "%"+tag+"%"
                    }
                }
            }
        }
        var examples = await Example.findAll(where);
        ctx.rest({
            examples: examples
        });
    },

    'GET /api/example/:id': async (ctx, next) => {
        var example = await Example.findById(ctx.params.id);
        ctx.rest(example);
    },

    'POST /api/example/save': async (ctx, next) => {
        var t = ctx.request.body;
           
        if (!t.tag || !t.tag.trim()) {
            throw new APIError('错误的输入', '标签不能为空');
        }
        var example = await Example.create({
            tag: t.tag.trim(),
            category: t.category,
            description: t.description,
            demo: t.demo
        });
        ctx.rest(example);
    },

    'PUT /api/example/update/:id': async (ctx, next) => {
        var t = ctx.request.body;
        if (!t.tag || !t.tag.trim()) {
            throw new APIError('错误的输入', '标签不能为空');
        }
        var example = await Example.findAll({
            where: {
                id: ctx.params.id
            }
        });
        if (!example) {
            throw new APIError('notfound', '没有找到这个id的实例: ' + ctx.params.id);
        }
        for(let tmp of example){
            tmp.tag = t.tag.trim();
            tmp.category = t.category;
            tmp.description = t.description;
            tmp.demo = tmp.demo;
            await tmp.save();
        }
        ctx.rest(example);
    },

    'DELETE /api/example/delete/:id': async (ctx, next) => {
        var example = await Example.findAll({
            where: {
                id: ctx.params.id
            }
        });
        if (!example) {
             throw new APIError('notfound', '没有找到这个id的实例: ' + ctx.params.id);
        }
        for(let tmp of example){
            await tmp.destroy();
        }
        ctx.rest(example);
    }
    
}
