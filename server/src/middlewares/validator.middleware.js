export const validateSchema = (schema) => (req, res, next) => {
    try {
        schema.parse(req.body);
        next();
    } catch (error) {
        return res
            .status(400)
            .json({ message: error.errors.map((error) => error.message) });
    }
};

//export const validateSchema = (schema) => (req, res, next) => {
//    try {
//        //si se valida el dato.. continua
//        schema.parse(req.body);
//        next();
//    } catch (error) {
//        //zod errors:
//        console.log(error.errors);
//        return res.status(400).json(error.errors.map((error) => error.message));
//    }
//};
