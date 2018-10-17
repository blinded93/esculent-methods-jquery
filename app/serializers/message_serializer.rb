class MessageSerializer < ActiveModel::Serializer
  attributes :id, :subject, :body, :read_at, :created_at
  belongs_to :sender
end
