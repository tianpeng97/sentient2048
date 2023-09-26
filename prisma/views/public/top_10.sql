SELECT
  accounts.id,
  accounts.username,
  accounts.highscore,
  accounts.date_completed
FROM
  accounts
ORDER BY
  accounts.highscore DESC,
  accounts.date_completed
LIMIT
  10;