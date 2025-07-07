const { sql } = require("../db");

exports.getAllServices = async ({ limit, offset, category, search, date }) => {
  let conditions = [];

  if (category) {
    conditions.push(sql`s.category = ${category}`);
  }

  if (search) {
    const likeTerm = `%${search}%`;
    conditions.push(
      sql`(s.name ILIKE ${likeTerm} OR s.description ILIKE ${likeTerm})`
    );
  }

  if (date) {
    // Filter services that have at least one date on the given day
    conditions.push(sql`EXISTS (
      SELECT 1 FROM dates d 
      WHERE d.service_id = s.id AND DATE(d.service_date) = ${date}
    )`);
  }

  let whereClause = sql``;

  if (conditions.length === 1) {
    whereClause = sql`WHERE ${conditions[0]}`;
  } else if (conditions.length > 1) {
    whereClause = sql`WHERE ${conditions.reduce(
      (acc, curr) => sql`${acc} AND ${curr}`
    )}`;
  }

  const services = await sql`
    SELECT s.*,
    COALESCE(AVG(r.rating), 0)::numeric(3,2) AS average_rating
    FROM services s
    LEFT JOIN reviews r ON r.service_id = s.id
    ${whereClause}
    GROUP BY s.id
    LIMIT ${limit}
    OFFSET ${offset}
  `;

  const [{ count }] = await sql`
    SELECT COUNT(*)::int AS count
    FROM services s
    ${whereClause}
  `;

  return { services, totalCount: count };
};

exports.getServiceById = async (id) => {
  const [service] = await sql`
    SELECT 
      s.*,
      COALESCE(AVG(r.rating), 0)::numeric(3,2) AS average_rating,
      (
        SELECT json_agg(d)
        FROM (
          SELECT id, service_date
          FROM dates
          WHERE service_id = s.id
          ORDER BY service_date ASC
        ) d
      ) AS dates
    FROM services s
    LEFT JOIN reviews r ON r.service_id = s.id
    WHERE s.id = ${id}
    GROUP BY s.id
  `;
  return service;
};

exports.createService = async (newService, dates) => {
  const [service] = await sql`INSERT INTO services ${sql(
    newService,
    "name",
    "description",
    "category",
    "image",
    "duration"
  )} RETURNING *`;

  // Insert all dates of this service
  for (const date of dates) {
    await sql`
      INSERT INTO dates (service_id, service_date)
      VALUES (${service.id}, ${date});
    `;
  }

  return service;
};

exports.updateService = async (id, updatedService) => {
  const { dates, ...serviceData } = updatedService;

  const [service] = await sql`
    UPDATE services SET ${sql(serviceData)} WHERE id = ${id} RETURNING *;
  `;

  if (dates && Array.isArray(dates)) {
    // Delete existing dates
    await sql`DELETE FROM dates WHERE service_id = ${id}`;

    // Insert new dates
    for (const service_date of dates) {
      await sql`
        INSERT INTO dates (service_id, service_date) VALUES (${id}, ${service_date})
      `;
    }
  }

  // Fetch updated dates
  const updatedDates = await sql`
    SELECT * FROM dates WHERE service_id = ${id} ORDER BY service_date
  `;

  // Return service with dates
  return { ...service, dates: updatedDates };
};

exports.deleteService = async (id) => {
  const service = await sql`DELETE FROM services WHERE id = ${id} RETURNING *`;
  return service[0];
};
