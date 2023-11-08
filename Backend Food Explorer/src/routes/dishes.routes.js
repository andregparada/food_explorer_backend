const { Router } = require("express");
const multer = require("multer");
const uploadConfig = require("../configs/upload");

const DishesController = require("../controllers/DishesController");
const DishImageController = require("../controllers/DishImageController");
const ensureAuthenticated = require("../middlewares/ensureAuthenticated");
const verifyUserAuthorization = require("../middlewares/verifyUserAuthorization")

const dishesRoutes = Router();
const upload = multer(uploadConfig.MULTER);


const dishesController = new DishesController();
const dishImageController = new DishImageController();

dishesRoutes.use(ensureAuthenticated);

dishesRoutes.post("/", verifyUserAuthorization("admin"), upload.single("image"), dishesController.create);
dishesRoutes.get("/:id", dishesController.show);
dishesRoutes.delete("/:id", verifyUserAuthorization("admin"), dishesController.delete);
dishesRoutes.get("/", dishesController.index);
dishesRoutes.put("/:id", upload.single("image"), dishesController.update)

module.exports = dishesRoutes;