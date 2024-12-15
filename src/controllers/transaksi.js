import pool from "../database/database.js";
import { BadRequestError } from "../errors/BadRequestError.js";
import { InternalServerError } from "../errors/InternalServerError.js";

export const getPenggunaTransaksi = async (req, res) => {
  const { penggunaId } = req.user;
  const { start, end } = req.query;

  let textQuery = `SELECT * FROM Transaksi t INNER JOIN Transaksi_Sampah ts ON t.transaksi_id = ts.transaksi_sampah_id INNER JOIN Sampah s ON ts.sampah_id = s.sampah_id INNER JOIN SUK ON s.suk_id = SUK.suk_id INNER JOIN Pengguna p ON t.pengguna_id = p.pengguna_id WHERE t.tipe_transaksi = 'masuk' AND `;

  let placeHolderCtr = 1;
  const whereClause = [`t.pengguna_id = $${placeHolderCtr++}`];
  const values = [penggunaId];

  if (start) {
    whereClause.push(`t.tanggal::DATE >= $${placeHolderCtr++}`);
    values.push(`'${start}'`);
  }

  if (end) {
    whereClause.push(`t.tanggal::DATE <= $${placeHolderCtr++}`);
    values.push(`'${end}'`);
  }

  const whereClauseStr = whereClause.join(" AND ");
  textQuery += whereClauseStr;

  textQuery += " ORDER BY t.tanggal DESC";

  const queryResult = await pool.query(textQuery, values);

  const groupedData = queryResult.rows.reduce((result, item) => {
    const {
      transaksi_id,
      tanggal,
      pengguna_id,
      tipe_transaksi,
      email,
      ...item_sampah
    } = item;

    let transaksi = result.find((t) => t.transaksi_id === transaksi_id);
    if (!transaksi) {
      transaksi = {
        transaksi_id,
        tanggal,
        pengguna_id,
        tipe_transaksi,
        email,
        item_sampah: [],
      };
      result.push(transaksi);
    }

    transaksi.item_sampah.push(item_sampah);

    return result;
  }, []);

  return res.json(groupedData);
};

export const getAllTransaksi = async (req, res) => {
  const { start, end, tipe_transaksi } = req.query;
  console.log(start, end, tipe_transaksi);

  let textQuery = `SELECT * FROM Transaksi t INNER JOIN Transaksi_Sampah ts ON t.transaksi_id = ts.transaksi_sampah_id INNER JOIN Sampah s ON ts.sampah_id = s.sampah_id INNER JOIN SUK ON s.suk_id = SUK.suk_id INNER JOIN Pengguna p ON t.pengguna_id = p.pengguna_id ORDER BY t.tanggal DESC`;

  const values = [];
  const whereClause = [];
  let placeHolderCtr = 1;

  if (start) {
    whereClause.push(`t.tanggal::DATE >= $${placeHolderCtr++}`);
    values.push(`'${start}'`);
  }

  if (end) {
    whereClause.push(`t.tanggal::DATE <= $${placeHolderCtr++}`);
    values.push(`'${end}'`);
  }

  if (tipe_transaksi === "masuk" || tipe_transaksi === "keluar") {
    whereClause.push(`t.tipe_transaksi = $${placeHolderCtr++}`);
    values.push(`${tipe_transaksi}`);
  }

  if (values.length !== 0) {
    textQuery += " WHERE ";
    const whereClauseStr = whereClause.join(" AND ");
    textQuery += whereClauseStr;
  }

  const queryResult = await pool.query(textQuery, values);

  const groupedData = queryResult.rows.reduce((result, item) => {
    const {
      transaksi_id,
      tanggal,
      pengguna_id,
      tipe_transaksi,
      email,
      ...item_sampah
    } = item;

    let transaksi = result.find((t) => t.transaksi_id === transaksi_id);
    if (!transaksi) {
      transaksi = {
        transaksi_id,
        tanggal,
        pengguna_id,
        tipe_transaksi,
        email,
        item_sampah: [],
      };
      result.push(transaksi);
    }

    transaksi.item_sampah.push(item_sampah);

    return result;
  }, []);

  return res.json(groupedData);
};

export const createTransaksi = async (req, res, next) => {
  const { item_sampah, pengguna_id, tipe_transaksi } = req.body;

  if (!item_sampah || item_sampah.length === 0 || !pengguna_id) {
    throw new BadRequestError("All specified field must be included");
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const transaksiTextQuery = `INSERT INTO Transaksi (pengguna_id,tipe_transaksi) VALUES($1, $2) RETURNING transaksi_id`;

    const transaksiValues = [pengguna_id, tipe_transaksi];
    const transaksiQueryResult = await client.query(
      transaksiTextQuery,
      transaksiValues
    );

    const transaksiId = transaksiQueryResult.rows[0].transaksi_id;

    const itemSampahText = [];
    const itemSampahValues = [];
    let placeHolderIdx = 1;

    for (const item of item_sampah) {
      itemSampahText.push(
        `($${placeHolderIdx++}, $${placeHolderIdx++}, $${placeHolderIdx++}, $${placeHolderIdx++})`
      );

      itemSampahValues.push(
        transaksiId,
        item.sampah_id,
        item.jumlah_sampah,
        item.harga_sampah
      );
    }

    const item_sampahQuery = `INSERT INTO Transaksi_Sampah(transaksi_sampah_id, sampah_id, jumlah_sampah, harga_sampah) VALUES ${itemSampahText.join(
      ", "
    )}`;
    await client.query(item_sampahQuery, itemSampahValues);

    for (const item of item_sampah) {
      if (tipe_transaksi === "masuk") {
        const updateTextQuery =
          "UPDATE Sampah SET kuantitas=kuantitas+$1 WHERE sampah_id=$2";
        const updateTextValues = [item.jumlah_sampah, item.sampah_id];

        await client.query(updateTextQuery, updateTextValues);
      } else {
        const updateTextQuery =
          "UPDATE Sampah SET kuantitas=kuantitas-$1 WHERE sampah_id=$2";
        const updateTextValues = [item.jumlah_sampah, item.sampah_id];

        await client.query(updateTextQuery, updateTextValues);
      }
    }

    await client.query("COMMIT");
    return res.json({ success: true });
  } catch (error) {
    console.log(error);
    await client.query("ROLLBACK");

    throw new InternalServerError("An unexpected error occurred");
  } finally {
    client.release();
  }
};
