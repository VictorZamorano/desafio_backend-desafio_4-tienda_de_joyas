import { handleErrors } from "../db/errors.js";
import { myModel } from "../models/model.js";

const get = async (req, res) => {
	res.json({ ok: true, msg: "Server OK" });
};

const getIdJewel = async (req, res) => {
	const { id } = req.params;
	try {
		const joyas = await myModel.getJewel(id);
		res.status(200).json({ ok: true, joyas });
	} catch (error) {
		console.log(error);
		const { status, message } = handleErrors(error.code);
		return res.status(status).json({ ok: false, result: message });
	}
};
const getAllJewels = async (req, res) => {
	const { limit = 3, page = 1, order_by = "id_asc" } = req.query;

	try {
		const joyas = await myModel.getJewels(limit, page, order_by);
		res.status(200).json({ ok: true, joyas });
	} catch (error) {
		console.log(error);
		const { status, message } = handleErrors(error.code);
		return res.status(status).json({ ok: false, result: message });
	}
};

const getJewelsFilters = async (req, res) => {
	const { precio_max, precio_min, categoria, metal } = req.query;

	try {
		validateFields(precio_max, precio_min, categoria, metal);
		const jewels = await myModel.setJewelsFilters(
			precio_max,
			precio_min,
			categoria,
			metal
		);
		res.status(200).json({ ok: true, msg: "Filters add", jewels });
	} catch (error) {
		console.log(error);
		const { status, message } = handleErrors(error.code);
		return res.status(status).json({ ok: false, result: message });
	}
};

const validateFields = (precio_max, precio_min, categoria, metal) => {
	try {
		if (precio_max !== null && precio_max !== undefined) {
			const precio_max_parse = parseInt(precio_max);
			if (isNaN(precio_max_parse)) {
				throw { code: "400" };
			}
		}
		if (precio_min !== null && precio_min !== undefined) {
			const precio_min_parse = parseInt(precio_min);
			if (isNaN(precio_min_parse)) {
				throw { code: "400" };
			}
		}

		if (categoria !== null && categoria !== undefined) {
			const isCategoryValid = validateCategory(categoria);
			if (!isCategoryValid) {
				throw { code: "400" };
			}
		}

		if (metal !== null && metal !== undefined) {
			const isMetalValid = validateMetal(metal);
			if (!isMetalValid) {
				throw { code: "400" };
			}
		}
	} catch (error) {
		throw error;
	}
};

const validateCategory = (categoria) => {
	const categoryConditions = [
		categoria.toLowerCase() === "aros",
		categoria.toLowerCase() === "collar",
		categoria.toLowerCase() === "anillo",
	];
	const oneConditionMet = categoryConditions.some((condition) => condition);

	return oneConditionMet;
};

const validateMetal = (metal) => {
	const metalConditions = [
		metal.toLowerCase() === "oro",
		metal.toLowerCase() === "plata",
	];
	const oneConditionMet = metalConditions.some((condition) => condition);

	return oneConditionMet;
};

export const myController = {
	get,
	getIdJewel,
	getAllJewels,
	getJewelsFilters,
};
