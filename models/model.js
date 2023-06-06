import { pool } from "../db/connections.js";

import format from "pg-format";
import { query } from "express";

const getJewels = async (limit, page, order_by) => {
	let invQuery =
		"SELECT id, nombre, categoria, metal, precio, stock FROM inventario";
	let queryParams = [];

	try {
		if (order_by) {
			const [field, direction] = order_by.split("_");
			queryParams.push(field, direction);
			invQuery += " ORDER BY %s %s";
		}

		if (limit) {
			queryParams.push(limit);
			invQuery += " LIMIT %s";
		}

		if (page) {
			queryParams.push((page - 1) * limit);
			invQuery += " OFFSET %s";
		}
		const formattedQuery = format(invQuery, ...queryParams);

		const { rows } = await pool.query(formattedQuery);

		console.log(rows);

		const results = rows.map((row) => {
			return {
				name: row.nombre,
				category: row.categoria,
				metal: row.metal,
				precio: row.precio,
				stock: row.stock,
				href: `http://localhost:3000/joyas/${row.id}`,
			};
		});

		const metaData = await getJewelsMetadata(limit, page);

		const resJson = {
			results,
			metaData,
		};
		return resJson;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

const getJewel = async (id) => {
	const invQuery =
		"SELECT id, nombre, categoria, metal, precio, stock FROM inventario WHERE id = $1";
	const value = [id];
	const { rows } = await pool.query(invQuery, value);

	const result = rows.map((row) => {
		return {
			BackToJewels: `http://localhost:3000/joyas`,
			id: row.id,
			name: row.nombre,
			category: row.categoria,
			metal: row.metal,
			precio: row.precio,
			stock: row.stock,
		};
	});

	return result;
};

const getJewelsMetadata = async (limit, page) => {
	try {
		const text = "SELECT count(*) as total_registros FROM inventario";
		const { rows: data } = await pool.query(text);

		const total_pages = Math.ceil(data[0].total_registros / limit);

		const meta = {
			total: data.length,
			limit: parseInt(limit),
			page: parseInt(page),
			total_pages,
			next:
				total_pages <= page
					? null
					: `http://localhost:3000/joyas?limit=${limit}&page=${
							parseInt(page) + 1
					  }`,
			previous:
				page <= 1
					? null
					: `http://localhost:3000/joyas?limit=${limit}&page=${
							parseInt(page) - 1
					  }`,
		};

		return meta;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

const setJewelsFilters = async (precio_max, precio_min, categoria, metal) => {
	let invQuery =
		"SELECT id, nombre, categoria, metal, precio, stock FROM inventario";
	let filters = [];

	try {
		if (precio_max) {
			filters.push(`precio <= ${precio_max}`);
		}
		if (precio_min) {
			filters.push(`precio >= ${precio_min}`);
		}
		if (categoria) {
			filters.push(`categoria = '${categoria}'`);
		}
		if (metal) {
			filters.push(`metal = '${metal}'`);
		}

		if (filters.length > 0) {
			filters = filters.join(" AND ");
			invQuery += ` WHERE ${filters}`;
		}

		const { rows: inventario } = await pool.query(invQuery);
		if (inventario.length === 0) {
			throw { code: "404" };
		}
		return inventario;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const myModel = {
	getJewels,
	getJewel,
	getJewelsMetadata,
	setJewelsFilters,
};
