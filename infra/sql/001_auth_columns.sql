alter table if exists users
  add column if not exists password_hash text,
  add column if not exists totp_secret text;

create unique index if not exists users_email_lower_idx on users (lower(email));
