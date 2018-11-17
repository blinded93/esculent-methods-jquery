class MessageSerializer < ActiveModel::Serializer
  attributes :id, :subject, :body, :read_at, :created_at, :user_id, :recipe_id

  belongs_to :sender
  belongs_to :recipient
  belongs_to :user
  belongs_to :recipe
end
