-- Crea los 4 usuarios preautorizados de HGD en auth.users.
-- Pega este archivo en el SQL Editor del dashboard de Supabase y ejecútalo.
-- Cambia v_password antes de correrlo.
-- Es idempotente: si un correo ya existe, lo salta.

DO $$
DECLARE
  v_user_id uuid;
  v_email text;
  v_password text := 'Hgd2025!CambiarEnProduccion';
  v_emails text[] := ARRAY[
    'juan@hgdsas.com',
    'mateo@hgdsas.com',
    'sara@hgdsas.com',
    'camilo@hgdsas.com'
  ];
BEGIN
  FOREACH v_email IN ARRAY v_emails LOOP
    IF EXISTS (SELECT 1 FROM auth.users WHERE email = v_email) THEN
      CONTINUE;
    END IF;

    v_user_id := gen_random_uuid();

    INSERT INTO auth.users (
      instance_id, id, aud, role, email, encrypted_password,
      email_confirmed_at, created_at, updated_at,
      raw_app_meta_data, raw_user_meta_data,
      confirmation_token, email_change, email_change_token_new, recovery_token
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      v_user_id, 'authenticated', 'authenticated', v_email,
      crypt(v_password, gen_salt('bf')),
      now(), now(), now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{}'::jsonb,
      '', '', '', ''
    );

    INSERT INTO auth.identities (
      id, user_id, identity_data, provider, provider_id,
      created_at, updated_at, last_sign_in_at
    ) VALUES (
      gen_random_uuid(), v_user_id,
      jsonb_build_object('sub', v_user_id::text, 'email', v_email),
      'email', v_email, now(), now(), now()
    );
  END LOOP;
END $$;
