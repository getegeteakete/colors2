-- Add payment_method column to payments table
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'card' 
CHECK (payment_method IN ('card', 'paypal', 'bank_transfer'));

-- Add bank transfer details columns
ALTER TABLE payments
ADD COLUMN IF NOT EXISTS bank_account_name TEXT,
ADD COLUMN IF NOT EXISTS bank_account_number TEXT,
ADD COLUMN IF NOT EXISTS bank_name TEXT,
ADD COLUMN IF NOT EXISTS bank_branch TEXT,
ADD COLUMN IF NOT EXISTS transfer_reference TEXT;

-- Add PayPal transaction ID
ALTER TABLE payments
ADD COLUMN IF NOT EXISTS paypal_transaction_id TEXT;

-- Create index for payment method
CREATE INDEX IF NOT EXISTS idx_payments_payment_method ON payments(payment_method);

