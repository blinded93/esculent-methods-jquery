class Message < ApplicationRecord
  belongs_to :sender,
    class_name: 'User',
    foreign_key: 'sender_id'
  belongs_to :recipient,
    class_name: 'User',
    foreign_key: 'recipient_id'
  belongs_to :user, optional:true
  belongs_to :recipe, optional:true

  default_scope { order(created_at: :desc) }
  scope :unread, -> { where(read_at: nil) }
  scope :read, -> { where.not(read_at: nil) }
  scope :shares, -> { where.not(recipe_id: nil) }
  scope :request, -> { where.not(user_id: nil) }
  scope :compositions, -> { where(recipe_id: nil, user_id: nil) }
  scope :drafts, -> { where(sender_id: nil) }
end
