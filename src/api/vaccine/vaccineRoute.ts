import { Router } from "express";

import errorHandler from "../../config/errorHandler.js";
import { adminAuth, isAdmin, isSuperAdmin, userAuth } from "../../middlewares/auth.js";
import vaccineController from "./vaccineController.js";
import childVaccineRouter from "./childVaccine/childVaccineRoute.js";

const vaccineRouter:Router = Router();

vaccineRouter.post('/',[adminAuth,isAdmin], errorHandler(vaccineController.register));
vaccineRouter.put('/:id',[adminAuth,isAdmin], errorHandler(vaccineController.update));
vaccineRouter.delete('/:id',[adminAuth,isAdmin], errorHandler(vaccineController.delete));
vaccineRouter.get('/',[adminAuth,isAdmin], errorHandler(vaccineController.getAll));
vaccineRouter.get('/:id',[adminAuth,isAdmin], errorHandler(vaccineController.getSingle));

vaccineRouter.use('/child',childVaccineRouter);



export default vaccineRouter;