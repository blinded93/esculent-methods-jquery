class Message < ApplicationRecord
  belongs_to :sender,
      class_name: 'User',
      foreign_key: 'sender_id'
  belongs_to :recipient,
      class_name: 'User',
      foreign_key: 'recipient_id'

  default_scope { order(created_at: :desc) }
  scope :unread, -> { where(read_at: nil) }
end
