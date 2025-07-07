const { sql } = require("../db");

exports.createRegistration = async (newRegistration) => {
  const [registration] = await sql`
    INSERT INTO registrations ${sql(
      newRegistration,
      "user_id",
      "date_id"
    )} RETURNING *`;
  return registration;
};

exports.getAllRegistrations = async ({ limit, offset }) => {
  const registrations = await sql`SELECT 
    r.id as registration_id,
    u.username,
    u.email,
    d.service_date,
    r.status,
    s.name AS service_name,
    s.image AS service_image
    FROM registrations r
    JOIN users u ON r.user_id = u.id
    JOIN dates d ON r.date_id = d.id
    JOIN services s ON d.service_id = s.id
    ORDER BY r.id ASC
    LIMIT ${limit}
    OFFSET ${offset}`;

  const [{ count }] = await sql`
    SELECT COUNT(*)::int as count FROM registrations
  `;

  return { registrations, totalCount: count };
};

exports.getRegistrationsByUser = async (userId, { limit, offset }) => {
  const registrations = await sql`
    SELECT 
      r.*,
      d.service_date,
      s.name AS service_name,
      s.image AS service_image,
      s.id AS service_id,
      (
        SELECT json_agg(to_json(ad))
        FROM (
          SELECT dt.id, dt.service_date
          FROM dates dt
          WHERE dt.service_id = s.id
            AND dt.id != r.date_id
          ORDER BY dt.service_date
        ) ad
      ) AS available_dates
    FROM registrations r
    JOIN dates d ON r.date_id = d.id
    JOIN services s ON d.service_id = s.id
    WHERE r.user_id = ${userId}
    LIMIT ${limit}
    OFFSET ${offset};
  `;

  const [{ count }] = await sql`
    SELECT COUNT(*)::int as count
    FROM registrations
    WHERE user_id = ${userId};
  `;

  return { registrations, totalCount: count };
};

exports.getRegistrationById = async (id) => {
  const [registration] = await sql`
    SELECT * FROM registrations WHERE id = ${id}`;
  return registration;
};

exports.updateRegistrationDate = async (registrationId, newDateId) => {
  const [updated] = await sql`
    UPDATE registrations
    SET date_id = ${newDateId}
    WHERE id = ${registrationId}
    RETURNING *`;
  return updated;
};

exports.updateRegistrationStatus = async (registrationId, newStatus) => {
  const [updated] = await sql`
    UPDATE registrations
    SET status = ${newStatus}
    WHERE id = ${registrationId}
    RETURNING *`;
  return updated;
};

exports.deleteRegistration = async (id) => {
  const registrations =
    await sql`DELETE FROM registrations WHERE id = ${id} RETURNING *`;
  return registrations[0];
};

exports.getRegistrationByUserAndDate = async (userId, dateId) => {
  const [registration] = await sql`SELECT * FROM registrations
    WHERE user_id = ${userId} AND date_id = ${dateId}`;
  return registration;
};