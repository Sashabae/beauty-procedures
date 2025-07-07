const { sql } = require("../db");

exports.createDates = async (serviceId, dates) => {
  const dateObjects = dates.map((date) => ({
    service_id: serviceId,
    service_date: date,
  }));

  const insertedDates = await sql`
    INSERT INTO dates ${sql(dateObjects, "service_id", "service_date")}
    RETURNING *
  `;

  return insertedDates;
};

exports.getDatesByServiceId = async (serviceId) => {
  const dates = await sql`SELECT * FROM dates WHERE service_id = ${serviceId}`;
  return dates;
};

exports.deleteDate = async (id) => {
  const dates = await sql`DELETE FROM dates WHERE id = ${id} RETURNING *`;
  return dates[0];
};

exports.getDateById = async (id) => {
  const [date] = await sql`SELECT * FROM dates WHERE id = ${id}`;
  return date;
};
