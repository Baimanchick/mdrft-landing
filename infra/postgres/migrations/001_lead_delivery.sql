CREATE TABLE lead_rate_limits (
  scope text NOT NULL CHECK (scope IN ('client', 'global')),
  bucket_key text NOT NULL CHECK (char_length(bucket_key) = 64),
  window_started_at timestamptz NOT NULL,
  request_count integer NOT NULL CHECK (request_count > 0),
  PRIMARY KEY (scope, bucket_key)
);

CREATE TABLE leads (
  submission_id uuid PRIMARY KEY,
  fingerprint text NOT NULL CHECK (char_length(fingerprint) = 64),
  lead_type text NOT NULL CHECK (
    lead_type IN ('booking', 'certificate', 'club', 'partnership')
  ),
  payload jsonb NOT NULL CHECK (jsonb_typeof(payload) = 'object'),
  telegram_message text NOT NULL CHECK (
    char_length(telegram_message) BETWEEN 1 AND 4096
  ),
  received_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE telegram_outbox (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  lead_id uuid NOT NULL UNIQUE REFERENCES leads(submission_id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'pending' CHECK (
    status IN ('pending', 'processing', 'delivered', 'dead_letter')
  ),
  attempt_count integer NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
  available_at timestamptz NOT NULL DEFAULT now(),
  locked_at timestamptz,
  lock_token uuid,
  last_error_code text,
  telegram_message_id bigint,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  delivered_at timestamptz,
  CHECK (
    (status = 'processing' AND locked_at IS NOT NULL AND lock_token IS NOT NULL)
    OR (status <> 'processing' AND locked_at IS NULL AND lock_token IS NULL)
  ),
  CHECK (
    (status = 'delivered' AND delivered_at IS NOT NULL AND telegram_message_id IS NOT NULL)
    OR (status <> 'delivered' AND delivered_at IS NULL)
  )
);

CREATE INDEX telegram_outbox_ready_idx
  ON telegram_outbox (available_at, id)
  WHERE status = 'pending';

CREATE INDEX telegram_outbox_processing_idx
  ON telegram_outbox (locked_at, id)
  WHERE status = 'processing';

CREATE INDEX telegram_outbox_terminal_idx
  ON telegram_outbox (updated_at, id)
  WHERE status IN ('delivered', 'dead_letter');

CREATE INDEX leads_created_at_idx ON leads (created_at);
